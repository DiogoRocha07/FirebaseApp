import { useState } from "react";
import "./home.css";

import { Link } from "react-router-dom";

import { auth } from '../../firebaseConnection'
import { signInWithEmailAndPassword } from "firebase/auth";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate()

  async function handleLogin(e){
    e.preventDefault();
    
    if(email !== '' && senha !== ''){
      
      await signInWithEmailAndPassword(auth, email, senha)
      .then(() =>{
        navigate('/admin', {replace: true} )
      })
      .catch(() => {
        console.log('ERRO AO FAZER LOGIN')
        setEmail('')
        setSenha('')
      })

    }else{
      alert("preencha todos os campos!")
    }
  }


  return (
    <div className="home-container">
      <h1>Lista de tarefas</h1>
      <span>Gerencie sua agenda de uma forma simples.</span>

      <form className="form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Digite seu email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
        <br />
        <input
          type="text"
          placeholder="Digite sua senha."
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit">Acessar</button>
      </form>

      <Link className="button-link" to="/register">Não possui uma conta? Cadastre-se</Link>
    </div>
  );
}
