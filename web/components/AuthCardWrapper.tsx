import React, { ReactNode } from "react";

interface AuthCardWrapperProps {
  children: ReactNode;
}

const AuthCardWrapper: React.FC<AuthCardWrapperProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full mx-auto max-w-md bg-gradient-to-r from-slate-gray/10 via-slate-gray/5 to-slate-gray/10 text-midnight-blue p-6 md:p-8 xl:p-10 rounded-lg shadow-lg shadow-midnight-blue/50">
        {children}
      </div>
    </div>
  );
};

export default AuthCardWrapper;
