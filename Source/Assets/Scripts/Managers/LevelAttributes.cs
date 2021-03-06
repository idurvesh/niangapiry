
using UnityEngine;
using System.Collections;

public class LevelAttributes : MonoBehaviour {
// Size of the level

public Rect bounds = new Rect( 0, 0, 100, 50);
public bool  ShowMapLimits = true;
public float fallOutBuffer = 5.0f;
public float colliderThickness = 10.0f;
public float MinScreenLimit = 0.0f;

// Sea Green For the Win!
private Color sceneViewDisplayColor= new Color (0.20f, 0.74f, 0.27f, 0.50f);
private GameObject createdBoundaries;

//static private LevelAttributes instance;

//static public LevelAttributes Get()
//{
//    if (!instance) {
//        instance = Object.FindObjectOfType(typeof(LevelAttributes)) as LevelAttributes;
//        if (!instance)
//            Debug.Log("There needs to be one active LevelAttributes script on a GameObject in your scene.");
//    }
//    return instance;
//}

//void  OnDisable (){
//    instance = null;
//}


void  OnDrawGizmos (){
 if (ShowMapLimits)
 {
	Gizmos.color = sceneViewDisplayColor;
	Vector3 lowerLeft= new Vector3 (bounds.xMin, bounds.yMax, 0);
	Vector3 upperLeft= new Vector3 (bounds.xMin, bounds.yMin, 0);
	Vector3 lowerRight= new Vector3 (bounds.xMax, bounds.yMax, 0);
	Vector3 upperRight= new Vector3 (bounds.xMax, bounds.yMin, 0);
	
	Gizmos.DrawLine (lowerLeft, upperLeft);
	Gizmos.DrawLine (upperLeft, upperRight);
	Gizmos.DrawLine (upperRight, lowerRight);
	Gizmos.DrawLine (lowerRight, lowerLeft);
 }
}

void  Start (){
    createdBoundaries = new GameObject("Created Boundaries");
	createdBoundaries.transform.parent = transform;

    GameObject leftBoundary = new GameObject("Left Boundary");
	leftBoundary.transform.parent = createdBoundaries.transform;
    BoxCollider boxCollider = (BoxCollider)leftBoundary.AddComponent(typeof(BoxCollider));
    boxCollider.size = new Vector3(colliderThickness, bounds.height + colliderThickness * 2.0f + fallOutBuffer, colliderThickness);
    boxCollider.center = new Vector3(bounds.xMin - colliderThickness * 0.5f, bounds.y + bounds.height * 0.5f - fallOutBuffer * 0.5f, 0.0f);

    GameObject rightBoundary = new GameObject("Right Boundary");
	rightBoundary.transform.parent = createdBoundaries.transform;
    boxCollider = (BoxCollider)rightBoundary.AddComponent(typeof(BoxCollider));
    boxCollider.size = new Vector3(colliderThickness, bounds.height + colliderThickness * 2.0f + fallOutBuffer, colliderThickness);
    boxCollider.center = new Vector3(bounds.xMax + colliderThickness * 0.5f, bounds.y + bounds.height * 0.5f - fallOutBuffer * 0.5f, 0.0f);

    GameObject topBoundary = new GameObject("Top Boundary");
	topBoundary.transform.parent = createdBoundaries.transform;
    boxCollider = (BoxCollider)topBoundary.AddComponent(typeof(BoxCollider));
	boxCollider.size = new Vector3 (bounds.width + colliderThickness * 2.0f, colliderThickness, colliderThickness);
    boxCollider.center = new Vector3(bounds.x + bounds.width * 0.5f, bounds.yMax + colliderThickness * 0.5f, 0.0f);

    GameObject  bottomBoundary = new GameObject("Bottom Boundary (Including Fallout Buffer)");
	bottomBoundary.transform.parent = createdBoundaries.transform;
    boxCollider = (BoxCollider)bottomBoundary.AddComponent(typeof(BoxCollider));
    boxCollider.size = new Vector3(bounds.width + colliderThickness * 2.0f, colliderThickness, colliderThickness);
    boxCollider.center = new Vector3(bounds.x + bounds.width * 0.5f, bounds.yMin - colliderThickness * 0.5f - fallOutBuffer, 0.0f);
	
	MinScreenLimit = gameObject.transform.position.y ;

//while (ShowMapLimits) yield return PleaseDrawGizmos;

}

void OnDestroy()
//void OnDisable()
{
    Debug.Log(" Bound Destroyed");
    DestroyImmediate(createdBoundaries);
}

}