import { useEffect, useState } from "react";

import { database } from "../services/firebase";
import { ref, onValue } from "firebase/database";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
  }
>;

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState();

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    onValue(
      roomRef,
      (room) => {
        const databaseRoom = room.val();
        const FirebaseQuestions: FirebaseQuestions =
          databaseRoom.questions ?? {};

        const parsedQuestions = Object.entries(FirebaseQuestions).map(
          ([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted,
              isAnswered: value.isAnswered,
            };
          }
        );

        setTitle(databaseRoom.title);
        setQuestions(parsedQuestions);
      },
      { onlyOnce: true }
    );
  }, [roomId]);

  return { questions, title };
}
