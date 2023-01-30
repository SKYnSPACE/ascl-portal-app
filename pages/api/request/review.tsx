import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

import { postMail } from "../../../libs/backend/postMail";

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

    const currentSemester = await client.semester.findFirst({
      where: {
        isCurrentSemester: true,
      }
    });

    const allReviewRequests = await client.request.findMany({
      where: {
        requestedFor: {
          id: +currentUser.id,
        },
      },
    });

    const pendingList = allReviewRequests.filter(request => request.status === 0);
    const acceptedList = allReviewRequests.filter(request => request.status === 1);
    const completedList = allReviewRequests.filter(request => request.status === 2);
    const declinedList = allReviewRequests.filter(request => request.status === -1);
    //user가 받은 세미나 리뷰 요청정보를 수집.

    // (요청정보에 해당하는 세미나 정보를 수집, 각각의 리스트에 패킹하여 반환)
    //pendingList 
    //acceptedList
    //declinedList
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
    dueDate.setDate(dueDate.getDate() + 15);

    const {
      body: { requestFor, alias },
      session: { user }
    } = req;

    // console.log(requestFor)

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
      }
    })

    //TODO: 아래 두 기능 동작 확인 필요. & error 코드 수정.
    // Prevent sending request to user itself.
    if (currentUser.id == +requestFor) {
      return res.status(403).json({ ok: false, error: { code: "403", message: "Not allowed to set yourself as a reviewer." } });//Not allowed to.
    }
    // Prevent duplicated request.
    const previousRequest = await client.request.findFirst({
      where: {
        requestedFor: {
          id: +requestFor,
        },
        kind: 90,
      },
    })

    if (previousRequest) {
      return res.status(409).json({ ok: false, error: { code: "409", message: "Conflicting request." } });//Conflict.
    }
    else {
      const newRequest = await client.request.create({
        data: {
          requestedFor: {
            connect: {
              id: +requestFor
            },
          },

          kind: 90,
          payload1: currentUser.id.toString(),
          payload2: currentUser.name.toString(),
          payload3: currentSemester.alias.toString(),
          payload4: currentSeminar.alias.toString(),
          payload5: currentSeminar.title.toString(),
          payload6: currentSeminar.tags.toString(),
          due: dueDate,
          status: 0,
        },
      });

      const user = await client.user.findUnique({
        where:{id:+requestFor}
      })

      postMail(
      `${user.email}`,
      `Peer Review Request from ${currentUser.name.toString()}`,
      "You have new seminar review request. Please check the request from the ASCL Portal.",
      `<p>You have new seminar review request. <br /> 
      Please check the request from the ASCL Portal.</p>
      <p>
      <b>Title: </b> ${currentSeminar.title.toString()} <br />
      <b>Presented by:</b> ${currentUser.name.toString()}<br />
      <b>Tags:</b> ${currentSeminar.tags.toString()}<br />
      <b>Abstract:</b> ${currentSeminar.abstract.toString()}</p>
      `,
      false);
    }

    // console.log(newRequest)

    res.json({
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);