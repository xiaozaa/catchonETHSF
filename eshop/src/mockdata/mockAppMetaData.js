const metaData = {
  "0x1234567891011121314151617181920212223456": {
    name: "App1",
  },

  "0x2235222391010f93831045a987b8920112512357": {
    name: "App2",
  },

  "0xe9385d02223910399c02958b03857a950e920dd2": {
    name: "App3",
  },
};

export function getMetaData(appAddress) {
  return metaData[appAddress];
}
