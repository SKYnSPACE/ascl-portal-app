// Set value as 0 -> 1
// 결제 후 실제 금액 입력 받을것.
// 잔고 계산 수행.
// 검수 양식 생성.
// 기한을 현시점에서 3일 연장, 

// GET: 모든 구매관련 action 리스트 반환. 
// 내가 취해야할 action 리스트와, 내가 모니터링중인 action 리스트 둘 다 표시.
// Actions -> Purchasing 탭에 내용 뿌릴 것.
//action (종류: 구매, 사용계정:~, 결제기한:~, )
//POST: action (철회 / )


//GET: 구매관련 요청 리스트 반환 (최근 2달)
//POST: 구매관련 Action 생성 [승인/pending/반려]

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
      body: { selectedAction,
        response, totalExpense,
      },
      session: { user }
    } = req;

    let dueDate = new Date();
    if (response == "FINISHED") {
      dueDate.setDate(dueDate.getDate() + 3);

      // const purchasedBy = await client.user.findUnique({
      //   where: { id: user.id },
      // });

//TODO: user.id !== relatedRequest.user.id(payload1) --> Not allowed!

      const projectToUse = await client.project.findUnique({
        where: { alias: selectedAction.projectAlias }
      })

      let updatedProject = null;
      switch (selectedAction.category) {
        case "DTE":
          updatedProject = await client.project.update({
            where: { id: projectToUse.id },
            data: {
              dteBalance: projectToUse.dteBalance - (+totalExpense),
              dteExeRate: +(100*(1-(projectToUse.dteBalance - (+totalExpense))/projectToUse.dtePlanned) || 100).toFixed(0),
            },
          })
          break;
        case "OTE":
          updatedProject = await client.project.update({
            where: { id: projectToUse.id },
            data: {
              oteBalance: projectToUse.oteBalance - (+totalExpense),
              oteExeRate: +(100*(1-(projectToUse.oteBalance - (+totalExpense))/projectToUse.otePlanned) || 100).toFixed(0),
            },
          })
          break;
      }

      const updatedAction = await client.action.update({
        where: { id: +selectedAction.id },
        data: {
          status: 1,
          payload7: totalExpense.toString(),
          completedAt: new Date(),
          due: dueDate,
        },
      })

      return res.json({
        ok: true,
        updatedProject,
        updatedAction,
      });
    }
    // Request Declined -> set action status 1 (due: +3)
    // if (response == "WITHDRAW") {
    //   dueDate.setDate(dueDate.getDate() + 3);

    //   const updatedAction = await client.action.update({
    //     where: { id: +selectedAction.id },
    //     data: {
    //       status: -1,
    //       due: dueDate,
    //     },
    //   })

      res.json({
        ok: false,
      });
    // }
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);