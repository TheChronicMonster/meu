import { ethers } from 'ethers';
import EducationPlatformABI from './EducationPlatformABI.json'; // The ABI of the contract
import EducationTokenABI from './EducationTokenABI.json'; // The ABI of the token contract

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const educationPlatformAddress = '0xYourEducationPlatformContractAddress';
const educationTokenAddress = '0xYourEducationTokenContractAddress';

const educationPlatformContract = new ethers.Contract(educationPlatformAddress, EducationPlatformABI, signer);
const educationTokenContract = new ethers.Contract(educationTokenAddress, EducationTokenABI, signer);

export const createCourse = async (title, description) => {
  const tx = await educationPlatformContract.createCourse(title, description);
  await tx.wait();
};

export const stakeAsInstructor = async (courseId) => {
  const tx = await educationPlatformContract.stakeAsInstructor(courseId);
  await tx.wait();
};

export const enrollInCourse = async (courseId) => {
  const tx = await educationPlatformContract.enrollInCourse(courseId);
  await tx.wait();
};

export const attestCourseCompletion = async (courseId, student) => {
  const tx = await educationPlatformContract.attestCourseCompletion(courseId, student);
  await tx.wait();
};

export const checkIn = async (courseId) => {
  const tx = await educationPlatformContract.checkIn(courseId);
  await tx.wait();
};
