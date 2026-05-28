import React, { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ArrowLeft, Menu, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

const queryClient = new QueryClient();

function TrackTransfer() {
  const [tab, setTab] = useState<"sender" | "receiver">("sender");
  const [mtcn, setMtcn] = useState("");
  const [step, setStep] = useState<"input" | "result">("input");

  const handleNext = () => {
    if (mtcn.length === 10) {
      setStep("result");
    }
  };

  const isNextDisabled = mtcn.length !== 10;

  return (
    <div className="min-h-[100dvh] w-full bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-md bg-white shadow-xl min-h-[100dvh] flex flex-col relative overflow-hidden">
        
        {/* Navigation Bar */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <Button variant="ghost" size="icon" className="text-primary hover:bg-gray-100" data-testid="button-back" onClick={() => step === "result" && setStep("input")}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold tracking-tight text-gray-900" data-testid="text-title">Track Transfer</h1>
          <Button variant="outline" size="icon" className="border-gray-200 text-gray-700 rounded-full" data-testid="button-menu">
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {step === "input" && (
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Tabs */}
            <div className="bg-white px-4 pt-2 pb-0 flex gap-4 border-b border-gray-100">
              <button
                className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${tab === "sender" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setTab("sender")}
                data-testid="tab-sender"
              >
                I'm the Sender
              </button>
              <button
                className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${tab === "receiver" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setTab("receiver")}
                data-testid="tab-receiver"
              >
                I'm the Receiver
              </button>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 p-6 flex flex-col">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-4">
                <p className="text-gray-600 text-sm mb-6 leading-relaxed" data-testid="text-instruction">
                  {tab === "sender" 
                    ? "To track a transfer, enter your 10-digit tracking number (MTCN):"
                    : "Enter the MTCN provided by your sender:"}
                </p>

                <div className="flex justify-center w-full mt-4 mb-8">
                  <InputOTP
                    maxLength={10}
                    value={mtcn}
                    onChange={(value) => setMtcn(value)}
                    data-testid="input-mtcn"
                    className="gap-2"
                  >
                    <InputOTPGroup className="gap-1.5 flex-wrap justify-center">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <InputOTPSlot 
                          key={index}
                          index={index} 
                          className="w-10 h-12 text-lg font-semibold bg-gray-50 border border-gray-200 rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </main>

            {/* Bottom Actions */}
            <div className="p-4 bg-white border-t border-gray-100 pb-8 sticky bottom-0">
              <Button
                className="w-full h-14 text-lg font-medium rounded-xl shadow-md transition-all"
                disabled={isNextDisabled}
                onClick={handleNext}
                data-testid="button-next"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === "result" && (
          <div className="flex-1 flex flex-col bg-gray-50 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Transfer Status</h2>
            
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden mb-6">
              <div className="bg-primary/5 px-6 py-8 border-b border-gray-100 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1" data-testid="text-status">Available for Pickup</h3>
                <p className="text-gray-500 font-medium" data-testid="text-mtcn-display">MTCN: {mtcn}</p>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-500">Amount</span>
                    <span className="text-xl font-bold text-gray-900" data-testid="text-amount">$500.00</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Sender</p>
                      <p className="font-semibold text-gray-900" data-testid="text-sender">John Doe</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Receiver</p>
                      <p className="font-semibold text-gray-900" data-testid="text-receiver">Jane Smith</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="font-medium text-gray-900" data-testid="text-date">{format(new Date(), "MMMM d, yyyy")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl p-6 mb-8">
              <h4 className="font-semibold text-gray-900 mb-6">Transfer Progress</h4>
              
              <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-primary text-white shadow shrink-0 z-10 -ml-11">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h5 className="font-semibold text-gray-900">Sent</h5>
                    <p className="text-sm text-gray-500">Money has been sent by John Doe.</p>
                  </div>
                </div>
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-primary text-white shadow shrink-0 z-10 -ml-11">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h5 className="font-semibold text-gray-900">Processing</h5>
                    <p className="text-sm text-gray-500">Transfer is being processed securely.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-primary text-white shadow shrink-0 z-10 -ml-11 animate-pulse">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h5 className="font-semibold text-primary">Available</h5>
                    <p className="text-sm text-gray-500">Ready for pickup at any agent location.</p>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={TrackTransfer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
