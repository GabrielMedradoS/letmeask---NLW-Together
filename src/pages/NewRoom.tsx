import { useContext } from "react";
import { AuthContext } from "../App";
import { Link } from "react-router-dom";

import illustrationImg from "../assets/illustration.svg";
import logoImg from "../assets/logo.svg";
import { Button } from "../components/Button";

import "../styles/auth.scss";

export function NewRoom() {
  const { user } = useContext(AuthContext);

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustraçao simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as duvidas da sua audiencia em tempo real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h1>{user?.name}</h1>
          <h2>Criar uma nova sala</h2>
          <form action="">
            <input type="text" placeholder="Nome da sala" />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma salça existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
