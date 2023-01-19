import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const {
      //TODO: alias가 함께 들어오면, review 내용을 반환할것
      // query:{alias},
      session: { user }
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const currentSemester = await client.semester.findFirst({
      where: {
        isCurrentSemester: true,
      }
    });

    const reviewers = await client.user.findMany({
      orderBy: {
        userNumber: 'asc',
        // userNumber: 'desc',
      },
      where: {
        position: {
          gte: 1,
        }
      },
      select: {
        id: true,
        name: true,
        requests: {
          where: {
            kind: 90,
            payload1: currentUser.id.toString(),
            payload3: currentSemester.alias.toString(),
          }
        }
      }
    })

    // console.log(reviewers)

    res.json({
      ok: true,
      reviewers,
    });
  }

  if (req.method === "POST") {
    //TODO: post review to the user.
    res.json({ ok: false });
  }

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);