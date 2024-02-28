import BusTimetable from "../models/busTimetable";
const data = [
  "1;0;07:00;08:30;10:00;11:30;13:00;14:30;16:00;17:30;19:00;20:30",
  "1;1;07:01;08:31;10:01;11:31;13:01;14:31;16:01;17:31;19:01;20:31",
  "1;2;07:03;08:33;10:03;11:33;13:03;14:33;16:03;17:33;19:03;20:33",
  "1;3;07:05;08:35;10:05;11:35;13:05;14:35;16:05;17:35;19:05;20:35",
  "1;4;07:06;08:36;10:06;11:36;13:06;14:36;16:06;17:36;19:06;20:36",
  "1;5;07:07;08:37;10:07;11:37;13:07;14:37;16:07;17:37;19:07;20:37",
  "1;6;07:09;08:39;10:09;11:39;13:09;14:39;16:09;17:39;19:09;20:39",
  "1;7;07:10;08:40;10:10;11:40;13:10;14:40;16:10;17:40;19:10;20:40",
  "1;8;07:12;08:42;10:12;11:42;13:12;14:42;16:12;17:42;19:12;20:42",
  "1;9;07:15;08:45;10:15;11:45;13:15;14:45;16:15;17:45;19:15;20:45",
  "1;10;07:16;08:46;10:16;11:46;13:16;14:46;16:16;17:46;19:16;20:46",
  "1;11;07:18;08:48;10:18;11:48;13:18;14:48;16:18;17:48;19:18;20:48",
  "1;12;07:19;08:49;10:19;11:49;13:19;14:49;16:19;17:49;19:19;20:49",
  "1;13;07:20;08:50;10:20;11:50;13:20;14:50;16:20;17:50;19:20;20:50",
  "1;14;07:21;08:51;10:21;11:51;13:21;14:51;16:21;17:51;19:21;20:51",
  "1;15;07:22;08:52;10:22;11:52;13:22;14:52;16:22;17:52;19:22;20:52",
  "1;16;07:23;08:53;10:23;11:53;13:23;14:53;16:23;17:53;19:23;20:53",
  "1;17;07:24;08:54;10:24;11:54;13:24;14:54;16:24;17:54;19:24;20:54",
  "1;18;07:25;08:55;10:25;11:55;13:25;14:55;16:25;17:55;19:25;20:55",
  "1;19;07:26;08:56;10:26;11:56;13:26;14:56;16:26;17:56;19:26;20:56",
  "1;20;07:27;08:57;10:27;11:57;13:27;14:57;16:27;17:57;19:27;20:57",
  "1;21;07:28;08:58;10:28;11:58;13:28;14:58;16:28;17:58;19:28;20:58",
  "1;22;07:30;09:00;10:30;12:00;13:30;15:00;16:30;18:00;19:30;21:00",
  "1;23;07:32;09:02;10:32;12:02;13:32;15:02;16:32;18:02;19:32;21:02",
  "1;24;07:33;09:03;10:33;12:03;13:33;15:03;16:33;18:03;19:33;21:03",
  "1;25;07:34;09:04;10:34;12:04;13:34;15:04;16:34;18:04;19:34;21:04",
  "1;26;07:35;09:05;10:35;12:05;13:35;15:05;16:35;18:05;19:35;21:05",
  "2;26;07:45;09:15;10:45;12:15;13:45;15:15;16:45;18:15;19:45;21:15",
  "2;25;07:46;09:16;10:46;12:16;13:46;15:16;16:46;18:16;19:46;21:16",
  "2;24;07:47;09:17;10:47;12:17;13:47;15:17;16:47;18:17;19:47;21:17",
  "2;23;07:48;09:18;10:48;12:18;13:48;15:18;16:48;18:18;19:48;21:18",
  "2;22;07:50;09:20;10:50;12:20;13:50;15:20;16:50;18:20;19:50;21:20",
  "2;21;07:52;09:22;10:52;12:22;13:52;15:22;16:52;18:22;19:52;21:22",
  "2;20;07:53;09:23;10:53;12:23;13:53;15:23;16:53;18:23;19:53;21:23",
  "2;19;07:54;09:24;10:54;12:24;13:54;15:24;16:54;18:24;19:54;21:24",
  "2;18;07:55;09:25;10:55;12:25;13:55;15:25;16:55;18:25;19:55;21:25",
  "2;17;07:56;09:26;10:56;12:26;13:56;15:26;16:56;18:26;19:56;21:26",
  "2;16;07:57;09:27;10:57;12:27;13:57;15:27;16:57;18:27;19:57;21:27",
  "2;15;07:58;09:28;10:58;12:28;13:58;15:28;16:58;18:28;19:58;21:28",
  "2;14;07:59;09:29;10:59;12:29;13:59;15:29;16:59;18:29;19:59;21:29",
  "2;13;08:00;09:30;11:00;12:30;14:00;15:30;17:00;18:30;20:00;21:30",
  "2;12;08:01;09:31;11:01;12:31;14:01;15:31;17:01;18:31;20:01;21:31",
  "2;11;08:02;09:32;11:02;12:32;14:02;15:32;17:02;18:32;20:02;21:32",
  "2;10;08:04;09:34;11:04;12:34;14:04;15:34;17:04;18:34;20:04;21:34",
  "2;9;08:05;09:35;11:05;12:35;14:05;15:35;17:05;18:35;20:05;21:35",
  "2;8;08:08;09:38;11:08;12:38;14:08;15:38;17:08;18:38;20:08;21:38",
  "2;7;08:10;09:40;11:10;12:40;14:10;15:40;17:10;18:40;20:10;21:40",
  "2;6;08:11;09:41;11:11;12:41;14:11;15:41;17:11;18:41;20:11;21:41",
  "2;5;08:13;09:43;11:13;12:43;14:13;15:43;17:13;18:43;20:13;21:43",
  "2;4;08:14;09:44;11:14;12:44;14:14;15:44;17:14;18:44;20:14;21:44",
  "2;3;08:15;09:45;11:15;12:45;14:15;15:45;17:15;18:45;20:15;21:45",
  "2;2;08:17;09:47;11:17;12:47;14:17;15:47;17:17;18:47;20:17;21:47",
  "2;1;08:19;09:49;11:19;12:49;14:19;15:49;17:19;18:49;20:19;21:49",
  "2;0;08:20;09:20;11:20;12:50;14:20;15:50;17:20;18:50;20:20;21:50",
];

export const BUSTIMETABLES = data.map((timetable) => {
  const [line, stop, ...schedule] = timetable.split(";");
  return new BusTimetable(parseInt(line), parseFloat(stop), schedule);
});