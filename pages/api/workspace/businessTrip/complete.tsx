// set processing action as completed. 1->2// set action as withdraw. 0-> -1


import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

import { postMail } from "../../../../libs/backend/postMail";

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
  NS: "지정요망",
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      body: { requestId, },
      session: { user }
    } = req;

    
      const currentUser = await client.user.findUnique({
        where: {
          id: +user.id,
        }
      })

      if (currentUser.position < 6)
      {
        return res.status(403).json({
          ok: false,
          error: { code: 403, message: "Not allowed to complete the request." }
        })
      }

      const updatedRequest = await client.request.update({
        where: {
          id: +requestId,
        },
        data: {
          status: 2,
          completedAt: new Date(),
          completedBy: currentUser.name,
        },
        include: {
          relatedAction: true,
        }
      })

      const updatedAction = await client.action.update({
        where:{
          id: updatedRequest.relatedAction.id,
        },
        data:{
          status: 2,
          completedAt: new Date(),
        }
      })

      return res.json({
        ok: true,
        updatedRequest,
        updatedAction,
      });
    
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);