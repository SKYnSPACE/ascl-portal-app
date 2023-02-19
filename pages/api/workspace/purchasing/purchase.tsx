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

import PizZip from "pizzip";
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import { mkdir, stat } from "fs/promises";
import path from 'path';

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
        response, purchasedFrom, totalPrice,
      },
      session: { user }
    } = req;

    let dueDate = new Date();
    if (response == "PURCHASED") {
      dueDate.setDate(dueDate.getDate() + 3);

      // const purchasedBy = await client.user.findUnique({
      //   where: { id: user.id },
      // });

//TODO: user.id !== relatedRequest.user.id(payload1) --> Not allowed!



      const projectToUse = await client.project.findUnique({
        where: { alias: selectedAction.projectAlias }
      })

      // console.log(projectToUse.mpePlanned == 0 ? 100 : 100*(1-(projectToUse.mpeBalance - (+totalPrice))/projectToUse.mpePlanned) || 100);

      let updatedProject = null;
      switch (selectedAction.category) {
        case "MPE":
          updatedProject = await client.project.update({
            where: { id: projectToUse.id },
            data: {
              mpeBalance: projectToUse.mpeBalance - (+totalPrice),
              mpeExeRate: projectToUse.mpePlanned == 0 ? 100 : +(100*(1-(projectToUse.mpeBalance - (+totalPrice))/projectToUse.mpePlanned) || 100).toFixed(0),
            },
          })
          break;
        case "CPE":
          updatedProject = await client.project.update({
            where: { id: projectToUse.id },
            data: {
              cpeBalance: projectToUse.cpeBalance - (+totalPrice),
              cpeExeRate: projectToUse.cpePlanned == 0 ? 100 : +(100*(1-(projectToUse.cpeBalance - (+totalPrice))/projectToUse.cpePlanned) || 100).toFixed(0),
            },
          })
          break;
        case "ME":
          updatedProject = await client.project.update({
            where: { id: projectToUse.id },
            data: {
              meBalance: projectToUse.meBalance - (+totalPrice),
              meExeRate: projectToUse.mePlanned == 0 ? 100 : +(100*(1-(projectToUse.meBalance - (+totalPrice))/projectToUse.mePlanned) || 100).toFixed(0),
            },
          })
          break;
        case "AE":
          updatedProject = await client.project.update({
            where: { id: projectToUse.id },
            data: {
              aeBalance: projectToUse.aeBalance - (+totalPrice),
              aeExeRate: projectToUse.aePlanned == 0 ? 100 : +(100*(1-(projectToUse.aeBalance - (+totalPrice))/projectToUse.aePlanned) || 100).toFixed(0),
            },
          })
          break;
      }

      const updatedAction = await client.action.update({
        where: { id: +selectedAction.id },
        data: {
          status: 1,
          payload9: totalPrice.toString(),
          payload11: purchasedFrom?.toString(),
          completedAt: new Date(),
          due: dueDate,
        },
      })



      const content = fs.readFileSync(
      path.join(process.env.ROOT_DIR || process.cwd(),
      `/public/documents`,`InspectionSheet.docx`),
      "binary"
      );
      const zip = new PizZip(content);
      const doc = new Docxtemplater (zip, {paragraphLoop:true, linebreaks:true,});
      let today = new Date();
      doc.render({
        year:today.getFullYear()?.toString(),
        month:(today.getMonth() + 1).toString(),
        day:today.getDate()?.toString(),
        purchasedAt: purchasedFrom?.toString(),
        totalPrice: totalPrice?.toLocaleString(),
        projectTitle: projectToUse?.title?.toString(),
      });
      const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
      });


      const uploadDir = path.join(process.env.ROOT_DIR || process.cwd(),`/public/exports`);
      
      try {
        await stat(uploadDir);
      } catch (e: any) {
        if (e.code === "ENOENT") {
          await mkdir(uploadDir, { recursive: true });
        } else {
          console.error(e);
          return;
        }
      }

      fs.writeFileSync(path.join(process.env.ROOT_DIR || process.cwd(),
      `/public/exports`,`${selectedAction.projectAlias}-${selectedAction.id}.docx`), buf);


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