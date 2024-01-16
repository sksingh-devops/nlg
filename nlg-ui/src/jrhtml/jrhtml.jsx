import React from 'react'
import { useNavigate } from 'react-router-dom'

const Jrhtml = () => {
    const navigate= useNavigate();
    const navigateHandler = ()=>{
        navigate("/jrleader")
    }
  return (
    <div>
        <div class="ranking-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
      <h1 class="display-4">Ranking</h1>
      <p class="lead">Players Ranking including score and par details.</p>
    </div>

    <div class="container">
      <div class="card-deck mb-3 text-center">
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Rank 1</h4>
          </div>
          <div class="card-body">
            <h3 class="card-title"><small class="text-muted">Sam Uutala</small></h3>
	    <h3 class="card-title">Score : <small class="text-muted">37</small></h3>
            <h3 class="card-title">Par : <small class="text-muted">35</small></h3>	
            <a onClick={navigateHandler} class="btn btn-lg btn-block btn-outline-primary">View Details</a>
          </div>
        </div>
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Rank 1</h4>
          </div>
          <div class="card-body">
            <h3 class="card-title"><small class="text-muted">Logan Keeter</small></h3>
	    <h3 class="card-title">Score : <small class="text-muted">37</small></h3>
            <h3 class="card-title">Par : <small class="text-muted">35</small></h3>	
            <a onClick={navigateHandler} class="btn btn-lg btn-block btn-outline-primary">View Details</a>
          </div>
        </div>
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Rank 2</h4>
          </div>
          <div class="card-body">
            <h3 class="card-title"><small class="text-muted">Grant Hahm</small></h3>
	    <h3 class="card-title">Score : <small class="text-muted">38</small></h3>
            <h3 class="card-title">Par : <small class="text-muted">35</small></h3>	
            <a onClick={navigateHandler} class="btn btn-lg btn-block btn-outline-primary">View Details</a>
          </div>
        </div>
      </div>    
    </div>


    <div class="container">
      <div class="card-deck mb-3 text-center">
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Rank 3</h4>
          </div>
          <div class="card-body">
            <h3 class="card-title"><small class="text-muted">Devin Swoyer</small></h3>
	    <h3 class="card-title">Score : <small class="text-muted">39</small></h3>
            <h3 class="card-title">Par : <small class="text-muted">35</small></h3>	
            <a onClick={navigateHandler} class="btn btn-lg btn-block btn-outline-primary">View Details</a>
          </div>
        </div>
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Rank 4</h4>
          </div>
          <div class="card-body">
            <h3 class="card-title"><small class="text-muted">Eli Kim</small></h3>
	    <h3 class="card-title">Score : <small class="text-muted">40</small></h3>
            <h3 class="card-title">Par : <small class="text-muted">35</small></h3>	
            <a onClick={navigateHandler} class="btn btn-lg btn-block btn-outline-primary">View Details</a>
          </div>
        </div>
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Rank 5</h4>
          </div>
          <div class="card-body">
            <h3 class="card-title"><small class="text-muted">Hunter Whitney</small></h3>
	    <h3 class="card-title">Score : <small class="text-muted">43</small></h3>
            <h3 class="card-title">Par : <small class="text-muted">35</small></h3>	
            <a onClick={navigateHandler} class="btn btn-lg btn-block btn-outline-primary">View Details</a>
          </div>
        </div>
      </div>    
    </div>


    <div class="container">
      <div class="card-deck mb-3 text-center">
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Rank 6</h4>
          </div>
          <div class="card-body">
            <h3 class="card-title"><small class="text-muted">Quinn Brown</small></h3>
	    <h3 class="card-title">Score : <small class="text-muted">46</small></h3>
            <h3 class="card-title">Par : <small class="text-muted">35</small></h3>	
            <a onClick={navigateHandler} class="btn btn-lg btn-block btn-outline-primary">View Details</a>
          </div>
        </div>
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Rank 7</h4>
          </div>
          <div class="card-body">
            <h3 class="card-title"><small class="text-muted">Cori</small></h3>
	    <h3 class="card-title">Score : <small class="text-muted">21</small></h3>
            <h3 class="card-title">Par : <small class="text-muted">19</small></h3>	
            <a onClick={navigateHandler} class="btn btn-lg btn-block btn-outline-primary">View Details</a>
          </div>
        </div>
<div class="card mb-4 hide"></div>
        
      </div>    
    </div>


    </div>
  )
}

export default Jrhtml
