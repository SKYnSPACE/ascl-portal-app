//GET: 구매관련 요청 리스트 반환 (최근 2달)
//POST: 구매관련 요청 생성
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

import { postMail } from "../../../libs/backend/postMail";

const PayMethods = {
  C: "카드",
  T: "계산서",
  P: "구매팀",
}
const Categories = {
  MPE: "재료비",
  CPE: "전산처리비",
  DTE: "국내출장비",
  OTE: "해외출장비",
  ME: "회의비",
  AE: "수용비",
  NS: "모름",
}

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

    if (currentUser.position < 3)
      return res.status(403).json({ ok: false, error: { code: "403", message: "Not allowed to access the data." } })


    const requests = await client.request.findMany({
      where: {
        OR: [
          { kind: 30 },
          { kind: 35 }
        ],
      },
      include: {
        requestedFor: {
          select:{
            name: true,
          }
        },
        relatedAction: {
          select: { 
            id: true,
            payload7: true, //to monitor actual business trip expenses.
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }]
    });

    res.json({
      ok: true,
      requests,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);