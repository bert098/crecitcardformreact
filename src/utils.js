import Payment from 'payment'

function clearNumber (value = '') {
  return value.replace(/\D+/g, '')
}

export async function formatCreditCardNumber (value) {
  if (!value) {
    return value
  }
  const clearValue = clearNumber(value)
  let nextValue
    nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
    4,
    8
    )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`
  return nextValue.trim()
}

export async function formatCVC (value = {}) {
  const clearValue = clearNumber(value)
  let maxLength = 3
  return clearValue.slice(0, maxLength)
}

export async function formatExpirationDate (value) {
  const clearValue = clearNumber(value)

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`
  }

  return clearValue
}
export async function formatName (value) {
    return value.replace(/[^a-zA-Z ]*$/g, '');
  }
