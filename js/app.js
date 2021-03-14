const vue = new Vue({
  el: '#app',
  data: {
    funds: []
  },
  methods: {
    selectFunds(fund) {
      let value = fund.codes.join(',')
      console.log(fund.name, value)
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          event: 'changeFunds',
          name: fund.name,
          value
        }, function (response) {
          console.log(response)
        })
      })
    },
    deleteFunds(fund) {
      chrome.storage.local.get(['funds'], (res) => {
        res.funds.splice(res.funds.findIndex(f => f.name == fund.name), 1)
        chrome.storage.local.set({ funds: res.funds }, () => {
          this.init()
        })
      })
    },
    openCompare() {
      chrome.windows.create({
        url: 'http://fund.eastmoney.com/Compare/'
      })
    },
    init() {
      chrome.storage.local.get(['funds'], (res) => {
        console.log(res)
        this.funds = res.funds
      })
    }
  },
  created() {
    console.log('created')
    this.init()
  }
})