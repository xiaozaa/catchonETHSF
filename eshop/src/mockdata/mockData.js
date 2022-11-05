var CoinKey = require("coinkey");

export let apps = {};

apps = mockApps();

function getAppTemplate() {
  return {
    name: "No Name",
    addr: "No Addr",
    date: "No Date",
    type: "No Type",
  };
}

export function getAppListData() {
  return apps;
}

export function addMockApp(mockObj) {
  var mockApp = getAppTemplate();
  Object.assign(mockApp, mockObj);
  mockApp.addr = randomAddr();
  mockApp.date = new Date().toISOString().slice(0, 10);
  console.log(`before push ${apps}`);
  apps.push(mockApp);
  console.log(apps);
}

function randomAddr() {
  var wallet = new CoinKey.createRandom();
  return wallet.publicAddress;
}

export function getMetaData(appAddress) {
  for (const app of apps) {
    if (app.addr == appAddress) return app;
  }
  return null;
}

function mockApps() {
  const response = [
    make({
      name: "App1",
      addr: "0x1234567891011121314151617181920212223456",
      date: "2022-10-10",
      type: "ERC721",
    }),

    make({
      name: "App2",
      addr: "0x2235222391010f93831045a987b8920112512357",
      date: "2022-10-13",
      type: "ERC721",
    }),

    make({
      name: "App3",
      addr: "0xe9385d02223910399c02958b03857a950e920dd2",
      date: "2022-09-29",
      type: "ERC20",
    }),
  ];
  return response;
}

function make({ name, addr, date, type } = {}) {
  return {
    name: name,
    addr: addr,
    date: date,
    type: type,
  };
}
