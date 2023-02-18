import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

const Duties = {
  seminar: 0b10000000,
  publications: 0b01000000,

  server: 0b00010000,
  computer: 0b00001000,

  safety: 0b00000010,
  news: 0b00000001,
}

function exclude<Seminar, Key extends keyof Seminar>(
  seminar: Seminar,
  keys: Key[]
): Omit<Seminar, Key> {
  for (let key of keys) {
    delete seminar[key]
  }
  return seminar
}


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const {
      query: { alias },
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

    const currentSeminar = await client.seminar.findUnique({
      where: {
        alias: alias.toString(),
      },
      include: {
        reviews: {
          include: {
            writtenBy: {
              select: {
                name: true,
              }
            },
          },
        },
        presentedBy: true,
      }
    });

    const ratings = await client.review.aggregate({
      where: {
        semesterId: + currentSemester.id,
        seminarId: + currentSeminar.id,
      },
      _avg: {
        rating1: true,
        rating2: true,
        rating3: true,
        rating4: true,
        rating5: true,
      },
      _count: {
        rating1: true,
      }
    })

    //내 세미나는 파일 조회 가능해야함.
    const isMine = (+currentUser.id == +currentSeminar.presentedById) ? true : false;
    const isDuty = (+currentUser.duties & Duties.seminar) ? true : false;
    const isAutorized = (currentUser.position >= 5) ? true : false;

    if (isMine || isDuty || isAutorized) {
      return res.json({
        ok: true,
        currentSeminar,
        ratings,
      });
    }

    else {
      const currentSeminarWithoutFiles = exclude(currentSeminar, ['draftFile', 'finalFile'])

      return res.json({
        ok: true,
        currentSeminar: currentSeminarWithoutFiles,
        ratings,
      });
    }



  }

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);