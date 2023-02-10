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
  if (req.method === "GET") {
    const {
      session: { user }
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    const createdPurchaseActions = await client.action.findMany({
      where:{
        kind: 30,
        payload1: currentUser.id.toString(),
      }
    })

    const myPurchaseActions = await client.action.findMany({
      where:{
        kind: 30,
        relatedRequest:{
          payload1: currentUser.id.toString(),
        }
      }
    })

    res.json({
      ok: true,
      createdPurchaseActions,
      myPurchaseActions,
    });
  }



  if (req.method === "POST") {
    const {
      body: { selectedRequest,
        response, projectAlias, category, message,
      },
      session: { user }
    } = req;

    let dueDate = new Date();
    // Request Approved -> set action status 0 (due: +7)
    if (response == "ACCEPT") {
      dueDate.setDate(dueDate.getDate() + 7);

      const approvedBy = await client.user.findUnique({
        where: { id: user.id },
      });

      const projectToUse = await client.project.findUnique({
        where: { alias: projectAlias }
      })

      const relatedRequest = await client.request.findUnique({
        where: { id: +selectedRequest.id },
        select: {
          userId: true
        }
      })
      const requestedUser = await client.user.findUnique({
        where: { id: +relatedRequest.userId }
      })

      const newAction = await client.action.create({
        data: {
          relatedRequest: {
            connect: {
              id: +selectedRequest.id
            },
          },

          kind: 30,
          payload1: approvedBy.id.toString(),
          payload2: approvedBy.name.toString(),
          payload3: projectToUse.alias.toString(),
          payload4: projectToUse.title.toString(),
          payload5: category.toString(),
          payload6: selectedRequest.item.toString(),
          payload7: selectedRequest.quantity.toString(),
          payload8: selectedRequest.payMethod.toString(),
          payload9: selectedRequest.amount.replaceAll(',', '').toString(),
          payload10: message.toString(),
          due: dueDate,
          status: 0,
        },
      });

      postMail(
        `${requestedUser.email}`,
        `Account usage (purchase) Request Approved by ${approvedBy.name.toString()}.`,
        `Your account usage request has been approved by ${approvedBy.name.toString()} Please make an action from the ASCL Portal.`,
        `<p>Your account usage request has been approved by ${approvedBy.name.toString()} <br /> 
        Please proceed your purchasing action from the
        <a href="http://ascl.kaist.ac.kr/portal" target="_blank" rel="noopener noreferrer">ASCL Portal</a>.<br />
        </p>
        <p>
        <b>계정(Account): </b> ${projectToUse.title.toString()} <br />
        <b>세목(Category): </b> ${Categories[category].toString()} <br />
        <b>품목/수량 Item (qty.):</b> ${selectedRequest.item.toString()} (x${selectedRequest.quantity.toString()})<br />
        <b>결제방법(Payment method):</b> ${PayMethods[selectedRequest.payMethod].toString()}<br />
        <b>금액(Price):</b> ${selectedRequest.amount.toString()}${selectedRequest.currency.toString()}</p>
        <b>안내사항(Message):</b> ${message.toString()}</p>
        `,
        true);


      res.json({
        ok: true,
        newAction,
      });
    }
    // Request Declined -> set action status 1 (due: +3)
    if (response == "DECLINE") {
      dueDate.setDate(dueDate.getDate() + 3);

      const declinedUser = await client.user.findUnique({
        where: { id: user.id },
      });

      res.json({
        ok: false,
        // newAction,
      });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);