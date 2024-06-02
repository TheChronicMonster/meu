import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import CourseManagement from './components/CourseManagement';
import Auth from './components/Auth';
import CourseCreator from './components/CourseCreator';
import InstructorStaker from './components/InstructorStaker';
import CourseEnroller from './components/CourseEnroller';
import CourseCompleter from './components/CourseCompleter';
import CourseList from './components/CourseList';
import MeUTokenABI from '../src/abi/MeUTokenABI.json';
import MeUPlatformABI from '../src/abi/MeUPlatformABI.json';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [platformContract, setPlatformContract] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();

        // Replace these addresses with the actual deployed contract addresses
        const tokenAddress = "0x8d6bf1822985d27275b008a751cA077bE9902945"; 
        const platformAddress = "0x790a8fd5c6265be0656a689d695e4f4becea4311"; 

        const tokenInstance = new web3Instance.eth.Contract(MeUTokenABI, tokenAddress);
        const platformInstance = new web3Instance.eth.Contract(MeUPlatformABI, platformAddress);

        setTokenContract(tokenInstance);
        setPlatformContract(platformInstance);

        // Fetch courses after setting the platform contract
        fetchCourses(platformInstance);
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initWeb3();
  }, []);

  const fetchCourses = async (platformContract) => {
    try {
      const courseCount = await platformContract.methods.courseIdCounter().call();
      const fetchedCourses = [];
      for (let i = 0; i < courseCount; i++) {
        const course = await platformContract.methods.courses(i).call();
        fetchedCourses.push(course);
      }
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div className="App">
      {token ? (
        <>
          <CourseManagement
            account={account}
            platformContract={platformContract}
            courses={courses}
            fetchCourses={() => fetchCourses(platformContract)}
          />
          <CourseCreator
            account={account}
            platformContract={platformContract}
            fetchCourses={() => fetchCourses(platformContract)}
          />
          <InstructorStaker
            account={account}
            platformContract={platformContract}
          />
          <CourseEnroller
            account={account}
            platformContract={platformContract}
            tokenContract={tokenContract}
          />
          <CourseCompleter
            account={account}
            platformContract={platformContract}
          />
          <CourseList
            account={account}
            platformContract={platformContract}
            tokenContract={tokenContract}
          />
          <button onClick={() => {
            setToken(null);
            localStorage.removeItem('token');
          }}>Logout</button>
        </>
      ) : (
        <Auth setToken={setToken} />
      )}
    </div>
  );
};

export default App;
