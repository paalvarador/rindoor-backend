import { Job } from 'src/jobs/entities/job.entity';

export const body = (to: string, subject: string, jobs: Job[]) => {
  return `<!DOCTYPE html>
<html>

<head>
  <link href="https://fonts.googleapis.com/css?family=Gotham:400,500,700" rel="stylesheet">
  <style>
    body {
      font-family: 'Gotham', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100%;
      margin: auto;
    }

    .container {
      width: 80%;
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 10px;
    }

    h2 {
      text-align: center;
      font-weight: 600;
    }

    .text {
      font-size: 16px;
      text-align: center;
    }

    .text p {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
      color: #41404699;
      font-weight: 400;
    }

    .copyright {
      font-size: 0.8em;
      font-weight: 600;
    }

    .table-container {
      margin-top: 1.5rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 10px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h2>${subject}</h2>
    <img src=${jobs[0].category.img} alt="Image" style="width: 100px; height: 100px;" />
    <p>Hey ${to}</p>
    <div class="table-container">
      <table>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Descripción</th>
          <th>Precio Base</th>
        </tr>
        ${jobs
          .map((job, index) => {
            if (index < 4) {
              return `<tr>
                        <td>${job.name}</td>
                        <td>${job.category.name}</td>
                        <td>${job.description}</td>
                        <td>${job.base_price}</td>
                      </tr>`;
            }
          })
          .join('')}
      </table>
    </div>
    <div>
      <p>Ultimos trabajos postulados</p>
    </div>
    <hr style="border: 1px solid #ccc; color: #41404626; margin-top: 70px; margin-bottom: 20px;">
    <div class="copyright">
      <p>My App rinDoor ©. All rights reserved.</p>
    </div>
  </div>
</body>

</html>
`;
};
