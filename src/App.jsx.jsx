import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

// --- Reusable Components ---

const Icon = ({ name, className = "w-6 h-6" }) => {
  const icons = {
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M17.25 12c0 2.895-2.355 5.25-5.25 5.25S6.75 14.895 6.75 12 9.105 6.75 12 6.75s5.25 2.355 5.25 5.25z" />,
    magic: <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.621m-1.622 3.385a15.998 15.998 0 01-1.622-3.385m1.622 3.385a15.998 15.998 0 003.388 1.622m-3.388-1.622a15.998 15.998 0 013.388 1.622m0 0a15.998 15.998 0 003.388-1.622m-3.388 1.622a15.998 15.998 0 01-3.388-1.622m5.043.025a15.998 15.998 0 00-1.622-3.385" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />,
    video: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  };
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>{icons[name]}</svg>;
};

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const base = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>{children}</button>;
};


// --- Authentication Screen ---
function AuthScreen({ auth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth) {
      setError("Authentication service is not ready. Please try again.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500">
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}


// --- Main Application Screens (Dashboard, etc.) ---
const mockProjects = [
  { id: 1, name: 'My Latest Podcast', status: 'Ready to Review', created: 'Oct 15, 2025', clips: [
      { id: 'c1', timestamp: 45, text: 'The first step is always the hardest, but putting in the work is what matters.' },
      { id: 'c2', timestamp: 312, text: "But what if I told you there's a better way to approach this problem?" },
      { id: 'c3', timestamp: 750, text: "Finally, we can reveal the secret sauce behind our success." },
  ]},
  { id: 2, name: 'Webinar Recording', status: 'Processing', created: 'Oct 15, 2025', clips: [] },
  { id: 3, name: 'Marketing Q&A', status: 'Exported', created: 'Oct 14, 2025', clips: [] },
];

function Dashboard({ setPage, setProject, user, auth }) {
  const projects = mockProjects;

  const handleSelectProject = (proj) => {
    if (proj.status === 'Exported') {
      setPage('download');
    } else {
      setPage('editor');
    }
    setProject(proj);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-gray-600 hidden sm:block">{user.email}</p>
          <Button onClick={handleSignOut} variant="secondary">
            <Icon name="logout" className="w-5 h-5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div onClick={() => setPage('repurpose-upload')} className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex flex-col items-center justify-center text-center">
            <Icon name="video" className="w-12 h-12 text-indigo-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Repurpose Video</h2>
            <p className="text-gray-500 mt-2">Upload a long-form video and find viral clips.</p>
        </div>
        <div onClick={() => setPage('ai-creation')} className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex flex-col items-center justify-center text-center">
            <Icon name="magic" className="w-12 h-12 text-purple-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Create with AI</h2>
            <p className="text-gray-500 mt-2">Generate a new video with AI avatars and voiceovers.</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">My Projects</h2>
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {projects.map(proj => (
            <li key={proj.id} onClick={() => handleSelectProject(proj)} className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
              <div>
                <p className="font-semibold text-gray-800">{proj.name}</p>
                <p className="text-sm text-gray-500">Created: {proj.created}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                proj.status === 'Ready to Review' ? 'bg-blue-100 text-blue-800' :
                proj.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>{proj.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function Editor({ project, setPage }) {
  if (!project || !project.clips || project.clips.length === 0) {
    return (
         <div className="p-8">
            <Button onClick={() => setPage('dashboard')} variant="secondary">&larr; Back to Dashboard</Button>
            <div className="text-center mt-20">
                <h2 className="text-2xl font-semibold text-gray-700">Project is processing...</h2>
                <p className="text-gray-500 mt-2">AI-suggested clips will appear here once the video has been analyzed.</p>
            </div>
        </div>
    )
  }

  const [selectedClip, setSelectedClip] = useState(project.clips[0]);

  return (
    <div className="h-screen flex flex-col">
       <header className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <Button onClick={() => setPage('dashboard')} variant="secondary">
            &larr; Back to Dashboard
          </Button>
          <h2 className="text-xl font-semibold">{project.name}</h2>
          <Button>
            <Icon name="download" />
            Export {project.clips.length} Clips
          </Button>
       </header>
       <main className="flex-1 grid grid-cols-3 gap-6 p-6 bg-gray-50 overflow-hidden">
          <div className="col-span-2 flex flex-col gap-4">
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-white">Video Preview for "{selectedClip.text}"</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-2">Edit Captions</h3>
                  <textarea className="w-full h-24 p-2 border rounded-md" defaultValue={selectedClip.text}></textarea>
              </div>
          </div>
          <div className="col-span-1 bg-white p-4 rounded-lg shadow-md overflow-y-auto">
              <h3 className="font-semibold mb-4">AI-Suggested Clips</h3>
              <ul className="space-y-2">
                {project.clips.map(clip => (
                  <li key={clip.id} onClick={() => setSelectedClip(clip)} 
                      className={`p-3 rounded-md cursor-pointer border-2 ${selectedClip.id === clip.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-gray-100'}`}>
                    <p className="text-sm text-gray-800 truncate">{clip.text}</p>
                    <p className="text-xs text-gray-500">Timestamp: {new Date(clip.timestamp * 1000).toISOString().substr(14, 5)}</p>
                  </li>
                ))}
              </ul>
          </div>
       </main>
    </div>
  );
}

function UploadScreen({ setPage, title, description, icon }) {
  return (
    <div className="p-8">
      <Button onClick={() => setPage('dashboard')} variant="secondary">&larr; Back</Button>
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <Icon name={icon} className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-gray-600 mb-8">{description}</p>
        <div className="bg-white p-10 rounded-lg shadow-lg border border-gray-200">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center">
                <Icon name="upload" className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Drag & drop your file here</p>
                <p className="text-gray-500 text-sm mb-4">or</p>
                <Button>Browse Files</Button>
            </div>
        </div>
      </div>
    </div>
  );
}


function AiCreationScreen({ setPage }) {
    return (
        <div className="p-8">
            <Button onClick={() => setPage('dashboard')} variant="secondary">&larr; Back</Button>
            <div className="max-w-3xl mx-auto mt-12 text-center">
                 <Icon name="magic" className="w-16 h-16 text-purple-500 mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-4">Create with AI</h1>
                <p className="text-lg text-gray-600 mb-8">Describe the video you want to create. The AI will generate a script, voiceover, and visuals.</p>
                
                <div className="bg-white p-8 rounded-lg shadow-lg border text-left">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">Your Prompt</label>
                    <textarea 
                        id="prompt"
                        rows="4"
                        className="w-full p-2 border rounded-md mb-4" 
                        placeholder="e.g., A 30-second video about the benefits of remote work, with an upbeat and energetic tone."
                    ></textarea>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="voice" className="block text-sm font-medium text-gray-700 mb-2">AI Voice</label>
                            <select id="voice" className="w-full p-2 border rounded-md">
                                <option>Friendly Male</option>
                                <option>Professional Female</option>
                                <option>Calm Male</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">Visual Style</label>
                            <select id="style" className="w-full p-2 border rounded-md">
                                <option>Minimalist Animation</option>
                                <option>Stock Footage Montage</option>
                                <option>Digital Avatar</option>
                            </select>
                        </div>
                    </div>

                    <Button className="w-full">
                        <Icon name="magic" />
                        Generate Video
                    </Button>
                </div>
            </div>
        </div>
    );
}

function DownloadScreen({ project, setPage }) {
    return (
        <div className="p-8">
            <Button onClick={() => setPage('dashboard')} variant="secondary">&larr; Back</Button>
            <div className="max-w-2xl mx-auto mt-12 text-center">
                <Icon name="download" className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-4">Downloads for {project.name}</h1>
                <p className="text-lg text-gray-600 mb-8">Your clips are ready. Click to download.</p>
                <div className="bg-white p-8 rounded-lg shadow-lg border space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <p>Clip 1 - The first step.mp4</p>
                        <Button>Download</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <p>Clip 2 - A better way.mp4</p>
                        <Button>Download</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- The Main App Component ---

function MainApp({ user, auth }) {
  const [page, setPage] = useState('dashboard');
  const [currentProject, setCurrentProject] = useState(null);

  const renderPage = () => {
    switch(page) {
      case 'editor':
        return <Editor project={currentProject} setPage={setPage} />;
      case 'download':
        return <DownloadScreen project={currentProject} setPage={setPage} />;
      case 'repurpose-upload':
        return <UploadScreen setPage={setPage} title="Repurpose Video" description="Upload your long-form video to get started." icon="video" />;
      case 'ai-creation':
        return <AiCreationScreen setPage={setPage} />;
      case 'dashboard':
      default:
        return <Dashboard setPage={setPage} setProject={setCurrentProject} user={user} auth={auth} />;
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {renderPage()}
    </div>
  );
}

export default function App({ auth }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe(); // Cleanup subscription on unmount
    } else {
        // If no auth object is passed, we know there is no user.
        setUser(null);
    }
  }, [auth]);

  // We show a loading screen until the user state is determined (either null or a user object)
  if (user === undefined) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return user ? <MainApp user={user} auth={auth} /> : <AuthScreen auth={auth} />;
}