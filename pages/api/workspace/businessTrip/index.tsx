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

    const myTripActions = await client.action.findMany({
      where:{
        kind: 35,
        relatedRequest:{
          payload1: currentUser.id.toString(),
        }
      },
      orderBy: [{ createdAt: 'desc' }]
    })

    const myTripRequests = await client.request.findMany({
      where:{
        kind: 35,
        payload1: currentUser.id.toString(),
        status: 0,
      },
      include:{
        requestedFor:{
          select:{
            name: true,
          }
        }
      },
      orderBy: [{ createdAt: 'desc' }]
    })

    res.json({
      ok: true,
      myTripActions,
      myTripRequests,
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

          kind: 35,
          payload1: approvedBy.id.toString(),
          payload2: approvedBy.name.toString(),
          payload3: projectToUse.alias.toString(),
          payload4: projectToUse.title.toString(),
          payload5: category.toString(),
          payload6: selectedRequest.destination.toString(),
          payload7: selectedRequest.amount.replaceAll(',', '').toString(),
          payload8: selectedRequest.startDate.toString(),
          payload9: selectedRequest.endDate.toString(),
          payload10: message.toString(),
          due: dueDate,
          status: 0,
        },
      });

      postMail(
        `${requestedUser.email}`,
        `Account usage (business trip) Request Approved by "${approvedBy.name.toString()}".`,
        `Your account usage (business trip) request has been approved by ${approvedBy.name.toString()} Please make an action from the ASCL Portal.`,
        `<p>Your account usage request (business trip) has been Approved by "${approvedBy.name.toString()}" <br /> 
        Please proceed your purchasing action from the
        <a href="http://ascl.kaist.ac.kr/portal" target="_blank" rel="noopener noreferrer">ASCL Portal</a>.<br />
        </p>
        <p>
        <b>계정(Account): </b> ${projectToUse.title.toString()} <br />
        <b>세목(Category): </b> ${Categories[category].toString()} <br />
        <b>목적지(Destination): </b> ${selectedRequest.destination.toString()}<br />
        <b>출장기간(Period): </b> ${selectedRequest.startDate.toString()} ~ {selectedRequest.endDate.toString()}<br />
        <b>예상비용(Est. Expenses):</b> ${selectedRequest.amount.toString()}${selectedRequest.currency.toString()}</p>
        <b>안내사항(Message):</b> ${message.toString()}</p>
        `,
        false);


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