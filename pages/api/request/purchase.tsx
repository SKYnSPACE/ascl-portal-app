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

    const allPurchaseRequests = await client.request.findMany({
      where: {
        kind: 30,
        requestedFor: {
          id: +currentUser.id,
        },
      },
    });

    const pendingList = allPurchaseRequests.filter(request => request.status === 0);
    const acceptedList = allPurchaseRequests.filter(request => request.status === 1);
    const completedList = allPurchaseRequests.filter(request => request.status === 2);
    const declinedList = allPurchaseRequests.filter(request => request.status === -1);

    res.json({
      ok: true,
      pendingList,
      acceptedList,
      completedList,
      declinedList,
    });
  }

  if (req.method === "POST") {
    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 4);

    const {
      body: { projectAlias, category,
        item, quantity,
        paymentMethod, totalPrice,
        details,
        requestFor },
      session: { user }
    } = req;

    console.log(req.body)

    const requestedUser = await client.user.findUnique({
      where: { id: user.id },
    });

    let requestedProject = { title: "Inquire for the suitable account." };
    if (projectAlias != "INQUIRE")
      requestedProject = await client.project.findUnique({
        where: { alias: projectAlias }
      })

    const requestee = await client.user.findUnique({
      where: { id: +requestFor }
    })

    // if (currentUser.id == +requestFor) {
    //   return res.status(403).json({ ok: false, error: { code: "403", message: "Not allowed to set yourself as an approver." } });//Not allowed to.
    // }

    const newRequest = await client.request.create({
      data: {
        requestedFor: {
          connect: {
            id: +requestFor
          },
        },

        kind: 30,
        payload1: requestedUser.id.toString(),
        payload2: requestedUser.name.toString(),
        payload3: requestedProject.title.toString(),
        payload4: Categories[category].toString(),
        payload5: item.toString(),
        payload6: quantity.toString(),
        payload7: PayMethods[paymentMethod].toString(),
        payload8: totalPrice.toString(),
        payload9: details.toString(),
        due: dueDate,
        status: 0,
      },
    });



    postMail(
      `${requestee.email}`,
      `Account usage (purchase) Request from ${requestedUser.name.toString()}`,
      "You have a new account usage request. Please check the request from the ASCL Portal.",
      `<p>You have a new account usage request. <br /> 
      Please check the request from the
      <a href="http://ascl.kaist.ac.kr/portal" target="_blank" rel="noopener noreferrer">ASCL Portal</a>.<br />
      </p>
      <p>
      <b>계정(Account): </b> ${requestedProject.title.toString()} <br />
      <b>세목(Category): </b> ${Categories[category].toString()} <br />
      <b>품목/수량 Item (qty.):</b> ${item.toString()} (x${quantity.toString()})<br />
      <b>결제방법(Payment method):</b> ${PayMethods[paymentMethod].toString()}<br />
      <b>금액(Price):</b> ${totalPrice.toString()}</p>
      <b>상세(Details):</b> ${details.toString()}</p>
      `,
      true);


    // console.log(newRequest)

    res.json({
      ok: true,
      newRequest,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);