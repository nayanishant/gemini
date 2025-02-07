import dayjs from "dayjs";

const categorizeChats = (sessions) => {
  const today = dayjs().startOf("day");
  const yesterday = today.subtract(1, "day");
  const lastWeek = today.subtract(7, "day");
  const last30Days = today.subtract(30, "day");
  const lastYear = today.subtract(1, "year");

  const chatGroups = new Map([
    ["Today", []],
    ["Yesterday", []],
    ["Last Week", []],
    ["Previous 30 Days", []],
    ["Last Year", []],
  ]);

  for (const session of sessions) {
    const sessionDate = dayjs(session.createdAt);

    if (sessionDate.isAfter(today)) chatGroups.get("Today").push(session);
    else if (sessionDate.isAfter(yesterday))
      chatGroups.get("Yesterday").push(session);
    else if (sessionDate.isAfter(lastWeek))
      chatGroups.get("Last Week").push(session);
    else if (sessionDate.isAfter(last30Days))
      chatGroups.get("Previous 30 Days").push(session);
    else if (sessionDate.isAfter(lastYear))
      chatGroups.get("Last Year").push(session);
  }

  return chatGroups;
};

export default categorizeChats;
