import { useParams } from "react-router-dom";

import logoImg from "../assets/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

import "../styles/room.scss";
import { useAuth } from "../hooks/useAuth";
import { useState, FormEvent } from "react";

import { database } from "../services/firebase";
import { ref, push } from "firebase/database";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState("");

  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId!);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await push(ref(database, `rooms/${roomId}/questions`), question);

    setNewQuestion("");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          {/* exclamaçao para marcar que o valor SEMPRE vai ser uma string e nao undefined */}
          <div>
            <RoomCode code={roomId!} />
            <Button isOutlined>Encerrar sala</Button>
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
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
