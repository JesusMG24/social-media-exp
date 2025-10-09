export default function PostForm(props) {

    const {
        username,
        editingId, setEditingId,
        showPost, setShowPost,
        showPostButton, setShowPostButton,
        postContent, setPostContent,
        postTitle, setPostTitle,
        handlePost
    } = props;
    
    return (
        <section>
            {showPost && (
                <form className="flex flex-col fixed w-full bg-black top-0 h-screen" onSubmit={handlePost}>
                    <div className="flex gap-[50vw] justify-around mt-5">
                        <button type="button" className="scale-x-150" onClick={() => {setShowPost(false); setShowPostButton(true); setEditingId(null); setPostContent(""); setPostTitle("");}}>
                            X
                        </button>
                        <button type="submit" className="bg-blue-500 rounded-full w-15 h-8">
                            {editingId ? "Save" : "Post"}
                        </button>
                    </div>
                    <h3 className="text-center mt-5">{username}</h3>
                    <div className="w-full flex flex-col items-center mt-5 text-xl gap-2">
                        <textarea value={postTitle} className="w-[80vw] max-h-[40vh] focus:outline-hidden" placeholder="Your post title..." onChange={(e) => {setPostTitle(e.target.value)}} rows={2}></textarea>
                        <textarea value={postContent} className="w-[80vw] max-h-[40vh] overflow-y-auto resize-none focus:outline-hidden" onChange={(e) => {setPostContent(e.target.value)}} rows={10} placeholder="What are you thinking?"></textarea>
                    </div>
                </form>
            )}
            <button onClick={() => {setShowPost(true); setShowPostButton(false);}} style={{ display: showPostButton && username ? "flex" : "none" }} className="fixed z-50 rounded-full bg-blue-500 flex aspect-square items-center justify-center w-15 bottom-[15vw] right-[5vw]">
                <p className="text-3xl">+</p>
            </button> 
        </section>
    )
}