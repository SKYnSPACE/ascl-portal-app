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

    const allTripRequests = await client.request.findMany({
      where: {
        kind: 35,
        requestedFor: {
          id: +currentUser.id,
        },
      },
    });

    const pendingList = allTripRequests.filter(request => request.status === 0);
    const acceptedList = allTripRequests.filter(request => request.status === 1);
    const completedList = allTripRequests.filter(request => request.status === 2);
    const declinedList = allTripRequests.filter(request => request.status === -1);

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
        destination, expense,
        startDate, endDate,
        details,
        requestFor },
      session: { user }
    } = req;

    const requestedUser = await client.user.findUnique({
      where: { id: user.id },
    });

    let requestedProject = { title: "Inquire for the suitable account.", alias:"INQUIRE`" };
    if (projectAlias != "INQUIRE")
      requestedProject = await client.project.findUnique({
        where: { alias: projectAlias }
      })

    const requestee = await client.user.findUnique({
      where: { id: +requestFor }
    })

    if (requestedUser.id == +requestFor) {
      return res.status(403).json({ ok: false, error: { code: "403", message: "Not allowed to set yourself as an approver." } });//Not allowed to.
    }

    const newRequest = await client.request.create({
      data: {
        requestedFor: {
          connect: {
            id: +requestFor
          },
        },

        kind: 35,
        payload1: requestedUser.id.toString(),
        payload2: requestedUser.name.toString(),
        payload3: requestedProject.alias.toString(),
        payload4: requestedProject.title.toString(),
        payload5: category.toString(),
        payload6: destination.toString(),
        payload7: expense?.toString(),
        payload8: startDate.toString(),
        payload9: endDate.toString(),
        payload10: details.toString(),
        due: dueDate,
        status: 0,
      },
    });



    postMail(
      `${requestee.email}`,
      `Business trip account Request from ${requestedUser.name.toString()}`,
      "You have a new business trip account request. Please check the request from the ASCL Portal.",
      `<p>You have a new business trip account request. <br /> 
      Please check the request from the
      <a href="http://ascl.kaist.ac.kr/portal" target="_blank" rel="noopener noreferrer">ASCL Portal</a>.<br />
      </p>
      <p>
      <b>계정(Account): </b> ${requestedProject.title.toString()} <br />
      <b>유형(Category): </b> ${Categories[category].toString()} <br />
      <b>목적지(Destination):</b> ${destination.toString()} <br />
      <b>예상비용(Expense):</b> ${expense ? expense.toString() : 'Unknown'}</p>
      <b>출장기간:</b> ${startDate.toString()} ~ ${endDate.toString()}<br />
      <b>상세(Details):</b> ${details.toString()}</p>
      `,
      false);


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