import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const currentSemester = await client.semester.findFirst({
      where: { isCurrentSemester: true }
    });

    const slots = await client.seminarslot.findMany({
      where: {
        semester: {
          id: currentSemester.id
        },
      },
      orderBy: [{ date: 'asc' }, { startsAt: 'asc' }],
      include:{
        seminar:{
          select:{
          title: true,
          alias: true,
          presentedBy:{
            select:{
              name: true,
            }
          },
          },
        },
      },
    })

    res.json({
      ok: true,
      currentSemester,
      slots,
    });
  }

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);