import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { query: { semester, seminar },
      session: { user } } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const currentSemester = await client.semester.findFirst({
      where: {
        isCurrentSemester: true,
      }
    });


    const mySeminarSubmission = await client.seminar.upsert({
      where: {
        alias: currentSemester.alias.toString() + '-' + currentUser.userNumber.toString()
        // presentedById: user?.id, // cannot use since it is not unique!
      },

      update: {},

      create: {

        alias: currentSemester.alias.toString() + '-' + currentUser.userNumber.toString(),

        semester: {
          connect: {
            id: currentSemester?.id
          },
        },
        presentedBy: {
          connect: {
            id: currentUser?.id
          },
        },

        progress: 0,

      },
    });


    //기존 프리젠테이션 찾아보기,
    //없으면 새로 생성.
    //프리젠테이션 정보를 FE에 반환


    res.json({
      ok: true,
      mySeminarSubmission,
    });
  }

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);