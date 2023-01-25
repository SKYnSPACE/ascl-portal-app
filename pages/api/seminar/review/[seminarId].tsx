import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const {
      //TODO?: alias가 함께 들어오면, review 내용을 반환할것
      // query:{alias},
      query: {seminarId},
      session: { user }
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const currentSeminar = await client.seminar.findUnique({
      where: { 
        id: +seminarId,
      }
    });

    const review = await client.review.findFirst({
      where: {
        writtenBy:{
          id: currentUser.id,
        },
        reviewFor: {
          id: currentSeminar.id,
        },
      },      
    })

    // console.log(review)

    res.json({
      ok: true,
      review,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);