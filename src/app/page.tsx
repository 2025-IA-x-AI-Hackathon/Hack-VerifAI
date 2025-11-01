"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [inputValue, setInputValue] = useState("");

  const placeholders = [
    "논문 URL을 입력하세요...",
    "연구 자료의 출처를 확인하세요...",
    "팩트체크가 필요한 기사 링크를 붙여넣으세요...",
    "검증하고 싶은 학술 자료 URL을 입력하세요...",
    "믿을 수 있는 연구인지 확인해보세요...",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSubmittedUrl(inputValue);
      setSubmitted(true);
      // Future: Call /api/ingest with the URL
      console.log("Submitted URL:", inputValue);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-background to-muted/20">
      <main className="w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="input-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              {/* Logo/Brand */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-5xl sm:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                >
                  TruAI
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
                >
                  AI 기반 팩트체크로 연구 자료의 신뢰성을 검증하세요
                </motion.p>
              </div>

              {/* Input Field */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="w-full max-w-2xl px-4"
              >
                <PlaceholdersAndVanishInput
                  placeholders={placeholders}
                  onChange={handleChange}
                  onSubmit={onSubmit}
                />
              </motion.div>

              {/* Subtle hint text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-xs sm:text-sm text-muted-foreground/60"
              >
                연구 논문, 기사, 학술 자료의 URL을 입력하고 Enter를 누르세요
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="verification-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              {/* Verification in progress UI */}
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                  />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    검증 중...
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto px-4">
                    제출하신 자료를 분석하고 있습니다
                  </p>
                </div>

                <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground max-w-xl mx-auto">
                  <p className="text-sm text-muted-foreground mb-2">제출된 URL:</p>
                  <p className="text-sm font-mono break-all">{submittedUrl}</p>
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSubmittedUrl("");
                    setInputValue("");
                  }}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  ← 다른 URL 검증하기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
