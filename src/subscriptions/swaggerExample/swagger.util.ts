import { stat } from 'fs';

export const examplePlans = [
  {
    price: 50,
    name: '50.00 usd/year ',
    currency: 'usd',
    price_cents: 5000,
    interval: 'year',
    id: 'price_1PG4dfCB2wIFzJht7bjOC2lV',
  },
  {
    price: 5,
    name: '5.00 usd/month ',
    currency: 'usd',
    price_cents: 500,
    interval: 'month',
    id: 'price_1PG4F2CB2wIFzJhtqqgBHU0P',
  },
];

export const exampleCreatedSubscription = {
  url: 'https://checkout.stripe.com/c/pay/cs_test_a1ZYyMiNaCn1NK9A1WiAkRr0AAL5TjOTL0vSbFBFp8ZpJFVr63wTVfI5iS#fid2cGd2ZndsdXFsamtQa2x0cGBrYHZ2QGtkZ2lgYSc%2FY2RpdmApJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRVQjRMb0ZHN3JMQ39PbXFhXExqdEhTVTIxQn1PMTFATz0xNDB%2FZmF1Ml1hZ1Y9QkNgaXI3SEd1UVNiUW1vUGxsYzJoZDVUN0xdZ2o9RktJR0R9f2tIVUE1NUlNNzFBVGQ9JyknY3dqaFZgd3Ngdyc%2FcXdwYCknaWR8anBxUXx1YCc%2FJ3Zsa2JpYFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl',
};

export const exampleUserOrPlanNotFound = [
  {
    message: 'Plan no encontrado',
    error: 'Not Found',
    statusCode: 404,
  },
  {
    message: 'Usuario no encontrado',
    error: 'Not Found',
    statusCode: 404,
  },
];
