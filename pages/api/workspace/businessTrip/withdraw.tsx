// set action as withdraw. 0-> -1


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
      body: { actionId,
        response,
      },
      session: { user }
    } = req;

    if (response == "WITHDRAW") {
      const updatedAction = await client.action.update({
        where: { id: +actionId },
        data: {
          status: -1,
          completedAt: new Date(),
        },
        // include: {
        //   relatedRequest: {
        //     select: {
        //       id: true
        //     },
        //   }
        // }
      })

      // const relatedRequest = await client.request.findUnique({
      //   where: {
      //     id: +updatedAction.requestId,
      //   }
      // })

      const updatedRequest = await client.request.update({
        where: {
          id: +updatedAction.requestId,
        },
        data: {
          status: 2,
          completedAt: new Date(),
        }
      })

      return res.json({
        ok: true,
        updatedAction,
        updatedRequest,
      });
    }


    res.json({
      ok: false,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);