#pragma strict

// This script moves the character controller forward
// Make sure to attach a character controller to the same game object.
private var thisTransform				: Transform;				// own player tranform cached
private var controller 					: CharacterController;
@HideInInspector public var properties 	: PlayerProperties;
@HideInInspector public var animPlay 	: AnimSprite; 				// : Component

var gravity 							: float = 20.0;
var fallSpeed 							: float = 0.5;				// speed of falling down ( division factor )

var walkSpeed							: float = 1.0;				// standard walk speed
var runSpeed  							: float = 2.0; 				// running speed 
	
var walkJump  							: float = 8.0;				// jump height from walk
var runJump   							: float = 9.0;				// jump height from run	

private var jumpEnable 					: boolean = false;			// toggle for default jump
private var runJumpEnable				: boolean = false;			// toggle for run jump

private var afterHitForceDown			: float = 1.0;				// toggle for crouch jump
private var isHoldingObj				: int 	= 0;				// anim row index change when player holds something

@HideInInspector public var orientation	: int = 1;					// Move Direction: -1 == left, +1 == right
@HideInInspector public var velocity 	: Vector3 = Vector3.zero;	// Start quiet 
@HideInInspector public var Depth		: float = .25f;				// Depth in position.z for the player's character

function Start()						//	var ballScript : BallScript = target.GetComponent(BallScript) as BallScript;
{
	thisTransform = transform;
    controller	= 	GetComponent( CharacterController );
    properties 	= 	GetComponent( PlayerProperties );
	animPlay 	=	GetComponent(AnimSprite);
	animPlay.PlayFrames(2 , 0, 1, orientation);
	
//	transform.GetComponentInChildren(BoxCollider).transform.position = controller.transform.position - Vector3(0, -.22,0);
}

function Update()
{
   isHoldingObj = System.Convert.ToByte( properties._pickedObject != null )	;
//   gravity = 20.0; 															// Refresh gravity force
   
   if ( controller.isGrounded )
	{
		jumpEnable 		= false;
		runJumpEnable 	= false;
		
		velocity = Vector3 ( Input.GetAxis( "Horizontal"), 0, 0 );
	
		if (!Input.GetAxis( "Horizontal") )									// IDLE -> keep stand quiet
			 animPlay.PlayFrames (2 + isHoldingObj, 0, 1, orientation );	
	
		if ( Input.GetAxis(	"Horizontal") )									// WALK
		{
			orientation = Mathf.Sign(velocity.x); 							// If move direction changes -> flip sprite
			
			velocity.x *= walkSpeed;										// If player is moving ->  Animate Walking..
			animPlay.PlayFrames ( 0 + isHoldingObj, 0, 8, orientation );	
		}	
		
		if ( velocity.x &&  Input.GetButton( "Fire1") )						// RUN 
		{
			velocity *= runSpeed;
			animPlay.PlayFrames ( 2, 1, 2, orientation );
		}

																			// JUMP
		if ( Input.GetButtonDown ( "Jump" ) && ( !Input.GetButton( "Fire1")	||  !velocity.x ) )	// Quiet jump
		{											// check player dont make a Running Jump being quiet in the same spot
			velocity.y = walkJump;
//			Instantiate ( particleJump, particlePlacement, transform.rotation );
//			PlaySound ( soundJump, 0);
			jumpEnable = true;
		}
		
		if ( Input.GetButtonDown( "Jump" ) && Input.GetButton( "Fire1") && velocity.x ) 	   // running jump
		{
			velocity.y = runJump;
//			Instantiate ( particleJump, particlePlacement, transform.rotation );
//			PlaySound ( soundJump, 0);
			runJumpEnable = true;
		}
	}
	
	if ( !controller.isGrounded )
	{
		velocity.x = Input.GetAxis( "Horizontal");
//		animPlay.PlayFrames ( 2, 5, 1, orientation );
		
		if ( Input.GetButtonUp ( "Jump" ) )						// check if the player keep pressing jump button..
			velocity.y *= fallSpeed ;							// if not then brake the jump
//			velocity.y -= 2 ;									// keep checking this value in case of bugs 
				
		if ( velocity.x )
			orientation = Mathf.Sign(velocity.x); 				// If move direction changes -> update & flip sprite
		
		if ( jumpEnable )
		{
			velocity.x *= walkSpeed;	 						// If player is jumping -> Update & Animate jumping type.
			animPlay.PlayFrames ( 2 + isHoldingObj, 4, 1, orientation );
		}
		
		if ( runJumpEnable )									
		{
			velocity.x *= runSpeed;
			animPlay.PlayFrames ( 2 + isHoldingObj, 4, 1, orientation );
		}
		
		if ( velocity.y < 0 ) 									// check when player stops elevation & becomes down..
		{
			animPlay.PlayFrames ( 2 + isHoldingObj, 5, 1, orientation );
		
			if ( Input.GetButton ( "Jump" )  && !isHoldingObj ) // check if the player keep pressing jump button..
			{
//		  	  gravity = 1.0 ;									// then use the hat to brake the gravity force like parachute
			  velocity.y += 19 * Time.deltaTime;
			  animPlay.PlayFrames ( 2, 6, 2, orientation );
			}
		}
	}
	
//	if ( controller.collisionFlags == CollisionFlags.Above )
//	{
//		velocity.y = 0;											// set velocity on Y to 0, stop upward motion
//		velocity.y -= afterHitForceDown;						// apply force downward so player doesn't have in the air
//	}

	velocity.y -= gravity * Time.deltaTime;
	controller.Move( velocity * Time.deltaTime );
		
	if (thisTransform.position.y < 0 )	thisTransform.position = Vector3( 0.5, 10, Depth );	// If character falls get it up again 

    thisTransform.position.z = Depth;
    thisTransform.rotation.y = 0;
    thisTransform.rotation.x = 0;
    // take Character Controller Skin Width = 0.05 else 0.001
}




// This Version of the Script allows to run without any buttons
//  just do a classic double tap & start running

//private var lastTime					: float = -1.0f;
//private var running 					: boolean = false;

//function UpdateTap()
//{
//   
//   //HoldingObj = System.Convert.ToByte(flipped < 0)	
//   gravity = 20.0;
//   
//   if ( controller.isGrounded )
//	{
//		jumpEnable 		= false;
//		runJumpEnable 	= false;
//		
//		velocity = Vector3 ( Input.GetAxis( "Horizontal"), 0, 0 );
//		
//		if ( !Input.GetAxis( "Horizontal") )								// IDLE -> keep stand quiet
//		{
//			 running = false;
//			 animPlay.PlayFrames (2 + isHoldingObj, 0, 1, orientation );	
//		}									
// 		
//		if ( Input.GetAxis( "Horizontal") ) 								// MOVE
//		{
//			orientation = Mathf.Sign(velocity.x); 				// If move direction changes -> update & flip sprite
//			
//			velocity.x *= walkSpeed;
//			animPlay.PlayFrames ( 0 + isHoldingObj, 0, 8, orientation );	
//
//			
//			if (running)
// 			{					
// 				velocity *= runSpeed;
//				animPlay.PlayFrames ( 2, 1, 2, orientation );
// 			}		
//			
//			if( Input.GetKeyDown( "left") || Input.GetKeyDown( "right") )		
//			{
//				running = (Time.time - lastTime < 0.2);						// RUN
//				lastTime = Time.time;
// 			}
//		}				
//
//																			// JUMP
//		if ( Input.GetButtonDown( "Jump" ) && (!running ) )				// check player dont make a Running Jump,
// 				//  being quiet in the same spot
//		{
//			velocity.y = walkJump;
////			Instantiate ( particleJump, particlePlacement, transform.rotation );
////			PlaySound ( soundJump, 0);
//			jumpEnable = true;
//		}
//		
//		if ( Input.GetButtonDown( "Jump" ) && running && velocity.x ) // running jump
//		{
//			velocity.y = runJump;
////			Instantiate ( particleJump, particlePlacement, transform.rotation );
////			PlaySound ( soundJump, 0);
//			runJumpEnable = true;
//		}
//	}
//	
//	if ( !controller.isGrounded )
//	{
//		velocity.x = Input.GetAxis( "Horizontal");
////		animPlay.PlayFrames ( 2, 3, 1, orientation );
//		
//		if ( Input.GetButtonUp ( "Jump" ) )						// check if the player keep pressing jump button..
//		{
//			velocity.y *= fallSpeed ;							// if not then brake the jump
//		}
//		
//		if ( velocity.x )
//		{
//			orientation = Mathf.Sign(velocity.x); 				// If move direction changes -> update & flip sprite
//		}
//		
//		if ( jumpEnable )
//		{
//			velocity.x *= walkSpeed;	 						// If player is moving -> Update & Animate Walking.
//			animPlay.PlayFrames ( 2 + isHoldingObj, 3, 2, 2, orientation );
//
//		}
//		
//		if ( runJumpEnable )
//		{
//			velocity.x *= runSpeed;
//			animPlay.PlayFrames ( 2 + isHoldingObj, 4, 1, orientation );
//
//		}
//		
//		if ( velocity.y < 0)
//		{
//			animPlay.PlayFrames ( 2 + isHoldingObj, 5, 1, orientation );
//		
//			if ( Input.GetButton ( "Jump" ) )						// check if the player keep pressing jump button..
//			{
//		  	  gravity = 1.0 ;							// if not then brake the gravity
//			  animPlay.PlayFrames ( 2 + isHoldingObj, 6, 2, orientation );
//			}
//		}
//	}
//	
////	if ( controller.collisionFlags == CollisionFlags.Above )
////	{
////		velocity.y = 0;									// set velocity on Y to 0, stop upward motion
////		velocity.y -= afterHitForceDown;				// apply force downward so player doesnŽt have in the air
////	}
//
//	velocity.y -= gravity * Time.deltaTime;
//	controller.Move( velocity * Time.deltaTime );
//	
//	
//	if (thisTransform.position.y < -5 )	thisTransform.position = Vector3( 0.5, 10, 0.25 );	// If character falls get it up again 
//}



