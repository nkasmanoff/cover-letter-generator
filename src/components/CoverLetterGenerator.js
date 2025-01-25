// components/CoverLetterGenerator.js
import Groq from "groq-sdk";
import React, { useState } from 'react';
import Footer from "./Footer";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";

const CoverLetterGenerator = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Please fill in both the resume and job description fields.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {

      const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY, dangerouslyAllowBrowser: true });
      
      const prompt = `Generate a professional cover letter based on the following resume and job description:

Resume:
${resume}

Job Description:
${jobDescription}

Please write a compelling cover letter that highlights relevant experience and skills from the resume that match the job requirements.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

      const generatedLetter = chatCompletion.choices[0]?.message?.content || "";
      console.log(generatedLetter);
      setCoverLetter(generatedLetter);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      setCoverLetter('Error generating cover letter. Please try again.');
    }
    setIsLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow flex items-center justify-center p-4 md:p-6 lg:p-8">
        <Card className="w-[95%] xl:w-[90%] 2xl:w-[85%] shadow-lg my-8 bg-white">
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cover Letter Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="col-span-full text-red-600 text-center font-medium">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume
                </label>
                <Textarea
                  id="resume"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume here"
                  className="min-h-[400px] resize-none border-2 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="jobDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description
                </label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here"
                  className="min-h-[400px] resize-none border-2 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading} 
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02]"
            >
              {isLoading ? 'Generating...' : 'Generate Cover Letter'}
            </Button>
            {coverLetter && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="coverLetter" className="block text-lg font-semibold text-gray-700">
                    Generated Cover Letter
                  </label>
                  <Button 
                    onClick={handleCopy} 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-blue-50"
                  >
                    Copy to Clipboard
                  </Button>
                </div>
                <Textarea
                  id="coverLetter"
                  value={coverLetter}
                  readOnly
                  className="min-h-[500px] resize-none bg-gray-50 border-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default CoverLetterGenerator;