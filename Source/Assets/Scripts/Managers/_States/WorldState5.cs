using UnityEngine;
using System.Collections;

public class WorldState5 : InGameState
{
    public override void Init()
    {
        Debug.Log("Enter World 5 State: Impenetrable");

        base.Init();
        Managers.Tiled.Load("/Levels/world5.tmx");

        //if ( Managers.Tiled.Load("/Levels/world5.tmx") )
        //    (Managers.Display.MainCamera).GetComponent<CameraScrolling>().ResetBounds();
        //else
        //    Debug.Log(" level map Not found");
    }

    public override void DeInit()
    {
        Debug.Log("Exit the current State and returning map");
        Managers.Tiled.Unload();
        base.DeInit();
    }

    public override void OnUpdate()
    {
        base.OnUpdate();
       
    }

    public override void Pause()
    {

    }

    public override void Resume()
    {

    }
}
