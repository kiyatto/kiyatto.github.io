// HomeView.jsx
const HomeView = () => {
  return (
    <div className='pt-100px' w-468px>
      <div className='flex flex-col gap-75px justify-start'>
        <h1 className='text-2xl text-left'>katreeya ong</h1>
        <p className='text-sm'>computer science, linguistics, and informatics @ university of washington</p>
        <div className='flex flex-row gap-25px pt-75px text-sm'>
          <a href='https://www.linkedin.com/katreeya-ong'>linkedin</a>
          <p>email</p>
          <p>cv</p>
        </div>
      </div>
    </div>
  );
};

export default HomeView;