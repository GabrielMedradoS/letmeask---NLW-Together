import { useEffect, useState } from "react";

import { database } from "../services/firebase";
import { ref, onValue, off } from "firebase/database";
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

export function useRoom(roomId: string) {
  const { user } = useAuth();
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
              likeCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {}).find(
                ([key, like]) => like.authorId === user?.id
              )?.[0],
            };
          }
        );

        setTitle(databaseRoom.title);
        setQuestions(parsedQuestions);
      }
      /*  ,{ onlyOnce: true } */
    );
    return () => {
      off(roomRef);
    };
  }, [roomId, user?.id]);

  return { questions, title };
}
