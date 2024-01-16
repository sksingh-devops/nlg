import { Spin } from 'antd';

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <Spin size="large"  />
      <span>.....</span>
    </div>
  );
};

export default LoadingScreen;
