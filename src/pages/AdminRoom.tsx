import { useParams, useNavigate } from "react-router-dom";

import logoImg from "../assets/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

import deleteImg from "../assets/delete.svg";
import "../styles/room.scss";
/* import { useAuth } from "../hooks/useAuth"; */

import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

import { database } from "../services/firebase";
import { ref, remove, update } from "firebase/database";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  /* const { user } = useAuth(); */
  const history = useNavigate();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId!);

  async function handleEndRoom() {
    update(ref(database, `rooms/${roomId}`), {
      endedAt: new Date(),
    });

    history("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Voce tem certeza que deseja excluir esta pergunta?")) {
      await remove(ref(database, `rooms/${roomId}/questions/${questionId}`));
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          {/* exclamaçao para marcar que o valor SEMPRE vai ser uma string e nao undefined */}
          <div>
            <RoomCode code={roomId!} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
