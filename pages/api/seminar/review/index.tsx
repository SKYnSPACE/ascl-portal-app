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

    const currentSeminar = await client.seminar.findFirst({
      where: { 
        semesterId: +currentSemester.id, 
        presentedById: +currentUser.id,
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

    const reviews = await client.review.findMany({
      orderBy:{
        updatedAt: 'asc',
      },
      where: { 
        seminarId: +currentSeminar.id, 
      },
      include: { 
        writtenBy:{ 
          select:{
          name: true,
          },
        },
      }
    })

    // console.log(reviews)

    res.json({
      ok: true,
      reviewers,
      reviews,
    });
  }

  if (req.method === "POST") {
    //TODO: post review to the user.
    const {
      body: { seminarId, requestId,
        title, comments,
        clarity, creativity, informative, integrity, verbosity
      },
      session: { user }
    } = req;

    // console.log(req.body)

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const currentSemester = await client.semester.findFirst({
      where: {
        isCurrentSemester: true,
      }
    });

    const currentSeminar = await client.seminar.findUnique({
      where: { id: +seminarId },
    });

    const relatedRequest = await client.request.findUnique({
      where: {id: +requestId,},
    })

    //TODO: upsert review to prevent multiple reviews from one user.
    const newReview = await client.review.create({
      data: {
        semesterId: +currentSemester.id,
        seminarId: +currentSeminar.id,
        title,
        comments,
        rating1:clarity,
        rating2:creativity,
        rating3:informative,
        rating4:integrity,
        rating5:verbosity,
        writtenById: +currentUser.id,
      },
    });

    // console.log(newReview)

    //TODO: 연결된 seminar progress 2로 조정할것.

    await client.seminar.update({
      where: {
        id: +currentSeminar.id,
      },
      data: {
        progress: 2,
      },
    });

//TODO: 연결된 request status를 2로 조정할것.
    await client.request.update({
      where: {
        id: +relatedRequest.id,
      },
      data:{
        status: 2,
      },
    })

    res.json({ ok: true,
      newReview,
   });
  }

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);