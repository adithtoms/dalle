import  React, { useState, useEffect } from 'react'
import { Loader, Card, FormField } from '../components'



const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return (
       data.map((post) => <Card key={post._id}{...post} />)
    )
  }

  return (
    <h2 className='mt-5 fond-bold'>{title}</h2>
  )


}

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  const fetchPosts = async () => {
    setLoading(true)

    try {
      const response = await fetch('https://dalle-dydy.onrender.com/api/v1/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()

        setAllPosts(result.data.reverse())
      }
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
        setSearchedResults(searchResult);
      }, 500),
    );
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[32px]'>Gallery</h1>
        <p className='text-[16px]'>Browse through a collection of imaginative and visually stunning images generated by AI</p>
      </div>
      <div className='mt-16'>
      <FormField
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className='mt-10'>
        {loading ? (
          <div className='flex justify-center items-center'>
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className='font-medium text-xl mb-3'>Showing result for: {searchText}</h2>
            )}
            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
            {searchText ? (
              <RenderCards
                data={searchedResults}
                title="No search results found" />
            ) : (
              <RenderCards
                data={allPosts}
                title="No posts yet" />
            )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Home