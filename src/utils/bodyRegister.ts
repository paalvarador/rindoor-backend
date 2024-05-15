import { User } from 'src/user/entities/User.entity';

export const bodyRegister = (to: string, subject: string, user: User) => {
  return `<!DOCTYPE html>
<html>

<head>
  <link href="https://fonts.googleapis.com/css?family=Gotham:400,500,700" rel="stylesheet">
  <style>
    body {
      font-family: 'Gotham', sans-serif;
    }

    .container {
      width: 500px;
      margin: 70px auto 0;
      text-align: center;
    }

    h2 {
      text-align: center;
      font-weight: 600;
    }

    .text {
      text-align: justify;
      font-weight: 20px;
    }

    .text p {
      margin-top: 10px;
      margin-bottom: 10px;
      color: #41404699;
      font-size: 16px;
      font-weight: 400;
    }

    .copyright {
      text-align: center;
      font-size: 0.8em;
      font-weight: 600;
    }
  </style>
</head>

<body>
  <div class="container">
    <h2>${to}</h2>

    <div class="text">
      <p>Regards! :</p>
      <p>${subject}</p>
    </div>

    <hr style="border: 1px solid #ccc; color: #41404626; margin-top: 70px; margin-bottom: 20px;">

    <div class="copyright">
   ${`<h1>${user.firstName}</h1>
                <p>${user.email}</p>
                <p>${user.phone}</p>
                <p>${user.role}</p>`}
    <p>My App rights reserved.</p>
    <p>My App rinDoor ©. All rights reserved.</p>
      <p>My App {{ data.year }} ©. All rights reserved.</p>
    </div>
  </div>
</body>

</html>`;
};
