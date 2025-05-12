'use client';

import StoriImage from '@/components/ui/StoriImage';
import { Link } from '@/i18n/routing';
import { ChevronLeft } from 'lucide-react';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import StoryInfo from './StoryInfo';
import ContentTable from './ContentTable';
import { BasicStoryInfo } from '@/types/Story';
import Cookies from 'js-cookie';
import { generateApi, GET_BASIC_INFO_STORY } from '@/constants/api';
import axios from 'axios';

const tabList = [
  { name: 'Story Info', id: 'info' },
  { name: 'Table of Contents', id: 'content' },
];

interface StoryDetailManagementProps {
  storyId: string;
}

const StoryDetailManagement = ({ storyId }: StoryDetailManagementProps) => {
  const [storyInfo, setStoryInfo] = useState<BasicStoryInfo | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState(tabList[0].id);

  const triggerUploadFile = () => {
    fileInputRef?.current?.click();
  };

  const handleUploadFile = async () => {
    if (uploadFile && storyInfo?.coverImageUri !== previewImage) {
      const formFile = new FormData();
      formFile.append('file', uploadFile as File);
      const token = Cookies.get('token');

      const uploadFileResult = await axios
        .post('/api/upload', formFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
          console.log('Error', error);
        });

      return uploadFileResult?.data.path;
    }

    return null;
  };

  const fetchStoryInfo = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_BASIC_INFO_STORY, storyId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setStoryInfo(response.data);
        setPreviewImage(response.data.coverImageUri);
      } else {
        console.error('Failed to fetch story info');
      }
    } catch (error) {
      console.error('Error fetching story info:', error);
    }
  }, [storyId]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }

      setUploadFile(file);

      const objectURL = URL.createObjectURL(file);
      setPreviewImage(objectURL);
    }
  };

  const resetPreviewImage = () => {
    if (previewImage !== storyInfo?.coverImageUri && previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    if (storyInfo?.coverImageUri) {
      setPreviewImage(storyInfo?.coverImageUri);
    } else {
      setPreviewImage(null);
    }

    setUploadFile(null);
  };

  useEffect(() => {
    fetchStoryInfo();
  }, [fetchStoryInfo]);

  return (
    <div className="pt-[100px] flex-col w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[70vw]  m-auto pb-5">
      <div className="w-full justify-between items-end p-3 flex">
        <Link
          href={`/mystory/manage`}
          className="flex gap-1 text-muted-foreground text-xs sm:text-base hover:underline items-center"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to My Stories</span>
        </Link>

        <div className="block text-right">
          <span className="text-sm md:text-xl font-bold text-muted-foreground">
            Edit
          </span>
          <h1 className="text-base md:text-2xl font-bold bg-rainbow text-transparent bg-clip-text">
            {storyInfo?.storyTitle}
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full justify-center items-center md:items-start gap-2">
        <div className="w-full md:w-[30%] flex flex-col justify-center items-center">
          {storyInfo && (
            <StoriImage
              source={previewImage}
              storyTitle={storyInfo?.storyTitle}
              className="w-[180px] h-[270px] 2xl:w-[240px] 2xl:h-[360px]"
            />
          )}
          <div className="flex gap-2 mt-3">
            <button
              className="py-1 px-2 bg-card rounded-md active:scale-95 transition-all duration-200 ease-in-out"
              onClick={triggerUploadFile}
            >
              Upload File
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <button className="bg-rainbow py-1 px-2 rounded-md active:scale-95 transition-all duration-200 ease-in-out">
              Generate With AI
            </button>
          </div>
          <div className="mt-2">
            <button
              className="px-3 py-1 rounded-md bg-card active:scale-95 transition-all duration-200 ease-in-out"
              onClick={resetPreviewImage}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="w-full md:w-[70%] bg-card rounded-md pb-3">
          <div className="flex justify-center md:justify-start border-b border-accent mb-3">
            {tabList.map((tab) => (
              <button
                key={tab.id}
                className={`${
                  activeTab === tab.id
                    ? 'text-purpleRainbow font-bold border-b-4 border-purpleRainbow'
                    : 'text-muted-foreground'
                } py-3 px-6 text-lg xl:text-xl transition-all duration-200 ease-in-out`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {activeTab == 'info' && storyInfo && (
            <StoryInfo
              story={storyInfo}
              fetchStoryInfo={fetchStoryInfo}
              handleUploadFile={handleUploadFile}
            />
          )}
          {activeTab == 'content' && <ContentTable storyId={storyId} />}
        </div>
      </div>
    </div>
  );
};

export default StoryDetailManagement;
