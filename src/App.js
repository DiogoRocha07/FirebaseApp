import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";

import "./app.css";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(listaPost);
      });
    }

    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin(){
     onAuthStateChanged(auth, (user) =>{
      if(user){
        // se tem usuario logado ele entra aqui....
        setUser(true)
        setUserDetail({
          uid: user.uid,
          email: user.email,
        })
      }else{
        //não possui nenhum user logado
        setUser(false)
        setUserDetail({})
      }
     }) 
    }

    checkLogin()
  }, [])

  //adicionando um novo post com id unico
  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    // .then(() => {
    //   console.log("dados registrados")
    // })
    // .catch((error) => {
    //   console.log("gerou erro" + error)
    // })

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("dados registrado");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        console.log("Ta dando errado ai" + error);
      });
  }

  //mostrando a lista de posts
  async function buscarPost() {
    //   const postRef = doc(db, "posts", "12345")

    //   await getDoc(postRef)
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().autor)
    //     setTitulo(snapshot.data().titulo)
    //   })
    //   .catch(() => {
    //     console.log('deu erro')
    //   })
    const postRef = collection(db, "posts");
    await getDocs(postRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(lista);
      })
      .catch((error) => {
        console.log("deu erro ao buscar");
      });
  }

  //atualizando os posts
  async function editarPost() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("POST ATUALIZADO");
        setAutor("");
        setTitulo("");
        setIdPost("");
      })
      .catch(() => {
        console.log("deu erro");
      });
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("Excluido com sucesso");
      })
      .catch(() => {
        console.log("deu erro");
      });
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        console.log("cadastrado");

        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("senha muito fraca.");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Email já existe");
        }
      });
  }
  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("feito");

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        });
        setUser(true);

        setEmail("");
        setSenha("");
      })
      .catch(() => {
        alert("Erro");
      });
  }

  async function logout() {
    await signOut(auth)
    .then(()=> {
      setUser(false)
      setUserDetail({})
    })
  }

  return (
    <div className="App">
      <h1>ReactJs + Firebase</h1>

      {user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado!)</strong> <br />
          <span>
            ID: {userDetail.uid} - Email: {userDetail.email}
          </span>{" "}
          <br />
          <button onClick={logout}>Logout</button>
          <br /> <br />
        </div>
      )}

      <div className="container">
        <h2>Usuarios</h2>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite um Email"
        />
        <br />
        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
        />
        <br />
        <button onClick={novoUsuario}>Cadastrar</button> <br />
        <button onClick={logarUsuario}>Efetuar login</button>
      </div>

      <br />
      <hr />

      <div className="container">
        <h2>
          <strong>POSTS</strong>
        </h2>
        <label>Id do Post:</label>
        <input
          placeholder="Digite o Id do Post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <label>Titulo:</label>
        <textarea
          type="text"
          placeholder="Digite o titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <label>Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />{" "}
        <br />
        <button onClick={handleAdd}>Cadastrar</button> <br />
        <button onClick={buscarPost}>Buscar posts</button> <br />
        <button onClick={editarPost}>Atualizar post</button> <br />
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>Id do Post: {post.id} </strong> <br />
                <span>Titulo: {post.titulo} </span> <br />
                <span>Autor: {post.autor} </span> <br />
                <button onClick={() => excluirPost(post.id)}>
                  Excluir
                </button>{" "}
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
