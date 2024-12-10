<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">

  ![favicon-96](https://github.com/user-attachments/assets/a65a9d18-2b15-42c3-a0b9-f77231645ab9)

  <h1 align="center">To-do List App</h1>

  <p align="center">
    A take-home assignment done by Sean
    <br />
    <br />
    <a href="https://todolistapp.fly.dev/">View Demo at todolistapp.fly.dev</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![image](https://github.com/user-attachments/assets/c7147f45-dfb9-4790-8174-6a86d336ab66)

This todo list app is a full stack application using Remix with SQLite and Prisma (SQLite database).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

### 1. Create and delete a TodoPage.

https://github.com/user-attachments/assets/cf0fc51f-0b45-479c-aaea-9b47b92a4fe9

### 2. Create, delete, and complete a Todo

https://github.com/user-attachments/assets/6a485763-4c85-427f-b843-bb57ed09678b

### 3. Each TodoPage is linked to a date. Use the calendar to traverse through the dates.

https://github.com/user-attachments/assets/6f3d52d8-a7ce-49d1-b661-8b25f14665ec

### Built With (initialised project with indie-stack)

- Remix (TypeScript)
- SQLite database
- Database ORM with Prisma
- Styling with TailwindCSS
- Component library Shadcn

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Add TodoPage feature
- [x] Add Todos feature
- [x] Search TodoPages based on date
- [x] Write unit tests incrementally during dev
- [ ] Use libSQL instead of SQLite and deploy on Turso
- [ ] e2e tests with Cypress and integration tests

<!-- GETTING STARTED -->

## Getting Started

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone https://github.com/SeansC12/to_do.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env` file and populate it with the below
   ```.env
   DATABASE_URL="file:./data.db?connection_limit=1"
   SESSION_SECRET="21378129378914719" # any secret will work
   ```
4. Initialise Prisma and seed the db
   ```sh
   npx remix init
   npm run setup
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

1. Create an account and log in to the application
2. Start creating TodoPages and Todos

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Sean Chua - [https://seanchua.vercel.app/](https://seanchua.vercel.app/) - sean.ulric.chua@gmail.com

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/sean-chua-142a17265/
