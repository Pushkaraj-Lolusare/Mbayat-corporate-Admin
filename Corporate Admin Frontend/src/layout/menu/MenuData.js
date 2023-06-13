const menu = [
  {
    heading: "Dashboards",
  },
  {
    icon: "home",
    text: "Dashboard",
    link: "/",
  },
  {
    heading: "MANAGEMENTS",
  },
  {
    icon: "gift",
    text: "Gifts",
    active: false,
    subMenu: [
      // {
      //   text: "Mystery Box Order",
      //   link: "/project-card",
      // },
      {
        text: "Subscriptions",
        link: "/subscriptions",
      },
    ],
  },
  // {
  //   icon: "bag",
  //   text: "Purchase",
  //   link: "/email-template",
  //   active: "false",
  // }, 
  {
    icon: "bag",
    text: "Orders",
    active: false,
    link: "/order-list-default",
    // subMenu: [
    //   {
    //     text: "Order List - Default",
    //     link: "/order-list-default",
    //   },
    //   {
    //     text: "Order List - Regular",
    //     link: "/order-list-regular",
    //   },
    //   {
    //     text: "Order List - Sales",
    //     link: "/order-list-sales",
    //   },
    // ],
  },
];
export default menu;
