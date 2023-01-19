import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";

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

    console.log(requestFor)

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
    //TODO: 중복요청 방지기능 필요...
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