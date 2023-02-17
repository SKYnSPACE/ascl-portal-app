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
    }); //내 세미나는 파일 조회 가능해야함.

    const presenters = await client.user.findMany({
      orderBy: {
        userNumber: 'asc',
        // userNumber: 'desc',
      },
      where: {
        position: {
          gte: 1,
          lt: 6,
        },
        seminarExemption: {
          not: true,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        presentedSeminars: {
          where: {
            semesterId: +currentSemester.id,
          },
          select: {
            alias: true,
            title: true,
            abstract: true,
            category: true,
            tags: true,
            waiver: true,
            skipReview: true,
            skipRevision: true,
            // reviews: true,
            currentStage: true,
          }
        },
      },
    })

    const stageCounts = await client.seminar.groupBy({
      by: ['currentStage'],
      where: {
        semesterId: +currentSemester.id,
        waiver: {
          not: true,
        },
        presentedBy: {
          position: {
            gte: 1,
            lt: 6,
          },
          seminarExemption: {
            not: true,
          },
        },
      },
      _count: {
        currentStage: true,
      },
      orderBy: {
        currentStage: 'asc',
      },
    })

    let progresses = [];
    if (stageCounts && stageCounts.length != 0) {
      stageCounts.map((item) => {
        progresses.push({ stage: item.currentStage, count: item._count.currentStage })
      })
      // console.log(progresses)
    }

    // console.log(reviews)

    res.json({
      ok: true,
      currentSemester,
      presenters,
      progresses,
    });
  }


}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);