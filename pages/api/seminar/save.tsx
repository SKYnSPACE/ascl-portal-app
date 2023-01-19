import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {


  if (req.method === "POST") {

    const {
      body: { title, abstract, category, tags, alias, file},
      session: { user },
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user?.id },
    });
    const currentSeminar = await client.seminar.findUnique({
      where: { alias: alias?.toString(), }
    });

    if (currentUser.id != currentSeminar.presentedById) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the seminar data." })
    }

    if (title && title !== currentSeminar?.title) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          title,
        },
      });
    }

    if (abstract && abstract !== currentSeminar?.abstract) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          abstract,
        },
      });
    }

    if (category && category !== currentSeminar?.category) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          category,
        },
      });
    }

    if (tags && tags !== currentSeminar?.tags) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          tags,
        },
      });
    }

    // console.log(req.body)

    // if (prevSemester == null) {
    //   await client.semester.update({
    //     where: {
    //       alias: semesterStringToAlias(semester),
    //     },
    //     data: {
    //       isCurrentSemester: true,
    //     },
    //   });
    //   return res.json({ ok: true, })
    // }

    // if (semester != prevSemester) {
    //   await client.semester.update({
    //     where: {
    //       alias: semesterStringToAlias(prevSemester),
    //     },
    //     data: {
    //       isCurrentSemester: false,
    //     },
    //   });

    //   await client.semester.update({
    //     where: {
    //       alias: semesterStringToAlias(semester),
    //     },
    //     data: {
    //       isCurrentSemester: true,
    //     },
    //   });
    // }

    const newFile = file?.name + '.' + file?.ext;
    if (file && newFile !== currentSeminar?.draft) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          draftFile: newFile,
          // progress: 1,
        },
      });
    }

    if ( +currentSeminar?.progress === 0 &&
      currentSeminar?.title  && 
      currentSeminar?.abstract  && 
      currentSeminar?.draftFile )
    {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          progress: 1,
        },
      });
    }

    res.json({ ok: true, })
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);