const orderPage = document.querySelector('#order-page')

orderPage.addEventListener('click', event => {
  switch (event.target.classList[0]) {
    case 'order-canceled':
      alert('本次訂單已取消，請重新下單!')
      break
    case 'order-payed':
      alert('本次訂單已付款!')
      break
  }
})